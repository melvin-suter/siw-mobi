import { Component, inject } from '@angular/core';
import { addMonths, set } from 'date-fns';
import { ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, alertCircleOutline, arrowBack, arrowForward, pricetag, search, swapVertical } from 'ionicons/icons';
import { IonRow, IonTitle, IonToolbar, ModalController, IonHeader, IonGrid, IonCol, IonSelect, IonSelectOption, IonIcon, IonItem, IonContent, IonInput, IonLabel, IonFooter, IonButton, IonButtons, IonFab, IonFabButton, IonItemDivider, IonItemGroup, IonList } from '@ionic/angular/standalone';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';
import { Expense } from 'src/app/shared/domain';
import ExpenseModalComponent from '../expense-modal/expense-modal.component';

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
    IonButtons,
    IonFab,
    IonList,
    IonFabButton,
    IonItemDivider,
    IonItemGroup,
    PageHeaderComponent,
  ]
})
export default class ExpenseListComponent {
  // DI
  private readonly modalCtrl = inject(ModalController);

  // State
  date = set(new Date(), { date: 1 });

  // Lifecycle

  constructor() {
    // Add all used Ionic icons
    addIcons({ swapVertical, pricetag, search, alertCircleOutline, add, arrowBack, arrowForward });
  }

  // Actions
  grouped_expenses:{date: string, expenses: Expense[]}[] = [
    {
      date: "2026-10-13",
      expenses: [{
        "id": "6acddeefccc7ce7159ea001c",
          "createdAt": "2026-10-13T07:34:07.545",
          "lastModifiedAt": "2026-10-13T07:34:07.545",
          "amount": 330.61,
          "category": {
              "id": "6acddeeeccc7ce7159e9ffe6",
              "createdAt": "2026-10-13T07:34:06.574",
              "lastModifiedAt": "2026-10-13T07:34:06.574",
              "name": "Unterhaltung"
          },
          "date": "2026-10-13",
          "name": "Bergbahn"
      },
      {
          "id": "6acddeeeccc7ce7159e9fff9",
          "createdAt": "2026-10-13T07:34:06.796",
          "lastModifiedAt": "2026-10-13T07:34:06.796",
          "amount": 443.44,
          "category": {
              "id": "6acddeeeccc7ce7159e9ffdb",
              "createdAt": "2026-10-13T07:34:06.494",
              "lastModifiedAt": "2026-10-26T07:05:24.835",
              "name": "Kleidung 1"
          },
          "date": "2026-10-13",
          "name": "Schuhe"
      }]
    },{
      date: "2026-10-12",
      expenses: [{
        "id": "6acddeefccc7ce7159ea001c",
          "createdAt": "2026-10-12T07:34:07.545",
          "lastModifiedAt": "2026-10-12T07:34:07.545",
          "amount": 330.61,
          "category": {
              "id": "6acddeeeccc7ce7159e9ffe6",
              "createdAt": "2026-10-12T07:34:06.574",
              "lastModifiedAt": "2026-10-12T07:34:06.574",
              "name": "Unterhaltung"
          },
          "date": "2026-10-12",
          "name": "Bergbahn"
      },
      {
          "id": "6acddeeeccc7ce7159e9fff9",
          "createdAt": "2026-10-12T07:34:06.796",
          "lastModifiedAt": "2026-10-12T07:34:06.796",
          "amount": 443.44,
          "category": {
              "id": "6acddeeeccc7ce7159e9ffdb",
              "createdAt": "2026-10-12T07:34:06.494",
              "lastModifiedAt": "2026-10-26T07:05:24.835",
              "name": "Kleidung 1"
          },
          "date": "2026-10-13",
          "name": "Schuhe"
      }]
    }
  ]



  async openModal(expense?:Expense): Promise<void> {
    const modal = await this.modalCtrl.create({ component: ExpenseModalComponent, componentProps: {expense} });
    modal.present();
    const { role, data } = await modal.onWillDismiss();

  }
}
