import { Component, computed, effect, inject, signal } from '@angular/core';
import { IonRow, IonTitle, IonToolbar, ModalController, IonHeader, IonGrid, IonCol, IonSelect, IonSelectOption, IonIcon, IonItem, IonContent, IonInput, IonLabel, IonFab, IonFabButton, ToastController, IonButtons, IonMenuButton, IonButton, IonFooter } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, alertCircleOutline, checkmarkCircle, chevronBack, chevronForward, search, swapVertical, warning } from 'ionicons/icons';
import CategoryModalComponent from '../category-modal/category-modal.component';
import { APIService } from 'src/app/shared/service/api.service';
import { Category } from 'src/app/shared/domain';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  imports: [
    ReactiveFormsModule,

    // Aaaand this list is why I hate angular and UI frameworks :)
    IonRow,
    IonGrid,IonCol,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonItem,
    IonContent,
    IonInput,
    IonLabel,
    IonFab,
    IonFabButton,
    PageHeaderComponent,
    IonButtons,
    IonButton,
    IonTitle,
    IonToolbar,
    IonFooter,
  ]
})
export default class CategoryListComponent {

  // DI
  private readonly modalCtrl = inject(ModalController);
  private readonly toast = inject(ToastController);

  // Lifecycle
  constructor() {
    // Add all used Ionic icons
    addIcons({ swapVertical, search, alertCircleOutline, add, warning, checkmarkCircle, chevronBack, chevronForward });
    effect(() => {
      this.loadCategories();
    })
  }

  // Actions

  async openModal(category?:Category): Promise<void> {
    const modal = await this.modalCtrl.create({ component: CategoryModalComponent, componentProps: {category} });
    modal.present();
    const { role, data } = await modal.onWillDismiss();

    if(role == "backdrop" || role == "cancel"){return}
    const request = (() => {
      switch(role){
        case 'save':
        case 'add': // This is not a good idea, to have create and modify in the same request....
          return this.api.fetch('categories', 'PUT', data);
          break;
        case 'delete':
          return this.api.fetch(`categories/${data.id}`, 'DELETE');
          break;
      }
      return null;
    })();
    if(request) {
      request.subscribe({
        next: () => {
          this.toast.create({
              message: "Category saved",
              duration: 3000,
              position: 'bottom',
              color: 'success',
              icon: 'checkmark-circle'
            })
            .then(toast => toast.present());
          this.loadCategories();
        },
        error: () => {
          this.toast.create({
              message: "Could not save category",
              duration: 5000,
              position: 'bottom',
              color: 'warning',
              icon: 'warning'
            })
            .then(toast => toast.present());
        }
      });
    } else {
      this.toast.create({
        message: "Something went wrong",
        duration: 5000,
        position: 'bottom',
        color: 'danger',
        icon: 'alert-circle'
      })
      .then(toast => toast.present());
    }
    this.loadCategories();
  }

  // New stuff ----------
  private api = inject(APIService);
  categories: Category[] = [];
  sort = signal('name,ASC');
  search = signal('');
  page = signal(0);
  totalPages = 0
  private query = computed(() => ({ sort: this.sort(), name: this.search(), page: this.page() }));

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.api.fetch<{content: Category[], totalPages: number}>('categories', 'GET',undefined,this.query()).subscribe({
      next: (data) => {
        this.categories = data.content;
        this.totalPages = data.totalPages
          this.page.set(Math.min(this.page(), this.totalPages - 1))
      },
      error: (err) => console.error(err),
    });
  }

  newCategory() {
    this.openModal(undefined)
  }

  openCategory(category:Category) {
    this.openModal(category)
  }
}
