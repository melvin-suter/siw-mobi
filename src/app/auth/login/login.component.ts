import { Component, inject } from '@angular/core';
import { IonRow, IonTitle, IonToolbar, ModalController, IonHeader, IonGrid, IonCol, IonSelect, IonSelectOption, IonIcon, IonItem, IonContent, IonInput, IonLabel, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, alertCircleOutline, search, swapVertical } from 'ionicons/icons';


@Component({
  selector: 'app-logint',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,

    // Aaaand this list is why I hate angular and UI frameworks :)
    IonHeader,
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
    IonFab,
    IonFabButton,
  ]
})
export default class CategoryListComponent {
  // DI
  private readonly modalCtrl = inject(ModalController);

  // Lifecycle

  constructor() {
  }

}
