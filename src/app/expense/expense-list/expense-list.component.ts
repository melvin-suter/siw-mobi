import { Component, inject } from '@angular/core';
import { addMonths, set } from 'date-fns';
import { ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, alertCircleOutline, arrowBack, arrowForward, pricetag, search, swapVertical } from 'ionicons/icons';
import { IonRow, IonTitle, IonToolbar, ModalController, IonHeader, IonGrid, IonCol, IonSelect, IonSelectOption, IonIcon, IonItem, IonContent, IonInput, IonLabel, IonFooter, IonButton, IonButtons, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { PageHeaderComponent } from 'src/app/shared/components/page-header/page-header.component';

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
    IonFabButton,
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

  addMonths = (number: number): void => {
    this.date = addMonths(this.date, number);
  };
}
