import { Component, inject, Input, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, calendar, cash, close, pricetag, save, text, trash } from 'ionicons/icons';
import CategoryModalComponent from '../../category/category-modal/category-modal.component';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonModal,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { Category, Expense } from 'src/app/shared/domain';
import { formatISO } from 'date-fns';
import { APIService } from 'src/app/shared/service/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-expense-modal',
  templateUrl: './expense-modal.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonNote,
    IonItem,
    IonInput,
    IonIcon,
    IonFab,
    IonFabButton,
    IonModal,
    IonSpinner,
    IonDatetime,
    IonDatetimeButton,
  ]
})
export default class ExpenseModalComponent {
  // DI
  private readonly modalCtrl = inject(ModalController);
  private readonly fb = inject(FormBuilder);
  private api = inject(APIService);
  private readonly toast = inject(ToastController);

  // Lifecycle

  constructor() {
    // Add all used Ionic icons
    addIcons({ close, save, text, pricetag, add, cash, calendar, trash });
  }

  // Actions

  cancel(): void {
    if(this.showSpinner()) {return}
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save(): void {
    this.add();
  }

  delete(): void {
    this.modalCtrl.dismiss(null, 'delete');
  }

  add(): void {
    if (this.form.invalid) return;

    this.showSpinner.set(true);

    this.api.fetch("expenses", "PUT", {...(this.expense ?? {}), ...this.form.getRawValue()}).subscribe({
      next: () => {
        this.toast.create({
          message: "Expense saved",
          duration: 3000,
          position: 'bottom',
          color: 'success',
          icon: 'checkmark-circle'
        })
        .then(toast => toast.present());
        
        this.modalCtrl.dismiss(null, 'add');
      },
      error: (e) => {
        console.log(e);
        this.toast.create({
          message: "Could not save expense\n" + e.error.message,
          duration: 5000,
          position: 'bottom',
          color: 'warning',
          icon: 'warning'
        })
        .then(toast => toast.present());
        this.showSpinner.set(false);
      }
    })

  }

  showSpinner = signal(false)

  nameInput = viewChild.required<IonInput>('nameInput')
  async ngOnInit() {

    if (this.expense) {
      this.form.patchValue({ categoryId: this.expense.category?.id ,date: this.expense.date, amount: this.expense.amount,name: this.expense.name });
    }
    this.loadCategories();
  }
  
  ionViewDidEnter(){
    this.nameInput().setFocus();
  }

  categories:Category[] = [];
  async loadCategories(pageInit?:number) {
    let page = pageInit ?? 0;
    if (page == 0) {
      this.categories = [];
    }

    let data = await firstValueFrom(this.api.fetch<{content: Category[], totalPages: number, sort: 'name,ASC'}>('categories', 'GET',undefined,{page}))
    this.categories = [...this.categories, ...data.content];
    if (data.totalPages > page + 1) {
      await this.loadCategories(page + 1)
    }
  }


  async showCategoryModal(): Promise<void> {
    const categoryModal = await this.modalCtrl.create({ component: CategoryModalComponent });
    categoryModal.present();
    const { role, data } = await categoryModal.onWillDismiss();
    
    if (role == "add") {
      let res = await firstValueFrom(this.api.fetch("categories", "PUT", data));
      await this.loadCategories();
      // in a GOOD backend you get an id here, and don't have to fish for it....
      for(let c of this.categories) {
        if(c.name == data.name) {
          this.form.controls.categoryId.setValue(c.id!)
        }
      }
    }
  }

  @Input() expense?:Expense;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]],
    categoryId: [''],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    date: [
      formatISO(new Date(), { representation: 'date' }),
      [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)],
    ],
  });
}
