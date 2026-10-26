import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { addMonths, set } from 'date-fns';
import { ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, alertCircleOutline, arrowBack, arrowForward, pricetag, search, swapVertical } from 'ionicons/icons';
import { IonRow, IonTitle, IonToolbar, ModalController, IonHeader, IonGrid, IonCol, IonSelect, IonSelectOption, IonIcon, IonItem, IonContent, IonInput, IonLabel, IonFooter, IonButton, IonButtons, IonFab, IonFabButton, IonItemDivider, IonItemGroup, IonList, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent, RefresherCustomEvent, IonRefresher, IonRefresherContent, IonSkeletonText } from '@ionic/angular/standalone';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { Category, Expense } from 'src/app/shared/domain';
import ExpenseModalComponent from '../expense-modal/expense-modal.component';
import { APIService } from 'src/app/shared/service/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  imports: [
    ReactiveFormsModule,
    IonToolbar,
    IonTitle,
    IonRow,
    IonGrid,IonCol,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonItem,
    IonContent,
    IonInput,
    IonLabel,
    IonFooter,
    IonButton,
    IonRefresher,
    IonRefresherContent,
    IonButtons,
    IonFab,
    IonList,
    IonFabButton,
    IonSkeletonText,
    IonItemDivider,
    IonItemGroup,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    PageHeaderComponent,
  ]
})
export default class ExpenseListComponent {
  // DI
  private readonly modalCtrl = inject(ModalController);
  private api = inject(APIService);

  // State
  date = set(new Date(), { date: 1 });
  sort = signal('date,DESC');
  search = signal('');
  page = signal(0);
  loading_categories = signal(true);
  loading_expenses = signal(true);
  loading = computed(() => this.loading_categories() || this.loading_expenses());
  selectedCategories = signal<string[]>([]);
  skeleton = signal(true)
  totalPages = signal(0)
  private query = computed(() => ({ yearMonth: this.current_year() +''+ this.current_month().toString().padStart(2,"0"), sort: this.sort(), name: this.search(), categoryIds: this.selectedCategories().join(",")  }));
  categories: Category[] = [];

  current_year = signal((new Date).getFullYear());
  current_month = signal((new Date).getMonth() + 1);
  current_month_name = computed(() => (
    [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember"
    ][this.current_month() - 1]
  ))
  noMoreData = computed(() => this.page() + 1 >= this.totalPages())

  // Lifecycle


  constructor() {
    // Add all used Ionic icons
    addIcons({ swapVertical, pricetag, search, alertCircleOutline, add, arrowBack, arrowForward });
    effect(() => {
      this.query();
      untracked(() => {
        this.page.set(0);
        this.loadExpenses();
      });
    });
  }

  ngOnInit() {
    this.loadExpenses()
    this.loadCategories();
  }

  async loadMore(event: InfiniteScrollCustomEvent) {
    await this.page.set(this.page() + 1)
    await this.loadExpenses(true)
     event.target.complete(); 
  }

  loadCategories(pageInit?:number) {
    let page = pageInit ?? 0;
    if (page == 0) {
      this.categories = [];
    }
      console.log(page)

    this.api.fetch<{content: Category[], totalPages: number}>('categories', 'GET',undefined,{page}).subscribe({
      next: (data) => {
        this.categories = [...this.categories, ...data.content];
        if (data.totalPages > page + 1) {
          this.loadCategories(page + 1)
        } else {
          this.loading_categories.set(false);
        }
      },
      error: (err) => console.error(err),
    });
    
  }

  async loadExpenses(append = false) {
    this.loading_expenses.set(true);
    if(!append) {
      this.skeleton.set(true)
    }

    let data = await firstValueFrom(this.api.fetch<{content: Expense[], totalPages: number}>('expenses', 'GET',undefined,{...this.query(), page: this.page()}))
    
    this.totalPages.set(data.totalPages);
    this.page.set(Math.min(this.page(), this.totalPages() - 1))

    let new_grouped:{date: string, expenses: Expense[]}[] = (append ? this.grouped_expenses : [])
    for(let expense of data.content) {
      let group = new_grouped.find(i => i.date == expense.date)
      if(group) {
        group.expenses.push(expense)
      } else {
        new_grouped.push({
          date: expense.date,
          expenses: [expense]
        })
      }
    }

    this.grouped_expenses = new_grouped
    this.loading_expenses.set(false);
    this.skeleton.set(false)
     
  }

  grouped_expenses:{date: string, expenses: Expense[]}[] = []


  changeSelector(c:number) {
    this.current_month.set(this.current_month() + c);
    if (this.current_month() > 12) {
      this.current_year.set(this.current_year() + 1);
      this.current_month.set(1);
    } else if (this.current_month() < 1) {
      this.current_year.set(this.current_year() - 1);
      this.current_month.set(12);
    }
  }

  async openModal(expense?:Expense): Promise<void> {
    const modal = await this.modalCtrl.create({ component: ExpenseModalComponent, componentProps: {expense} });
    modal.present();
    const { role, data } = await modal.onWillDismiss();

    if (role != "backdrop" && role != "cancel") {
      this.loadExpenses();
    }
  }
  
  async refresh(event: RefresherCustomEvent) {
    this.page.set(0);
    await this.loadExpenses();
    await event.target.complete();
  }
}
