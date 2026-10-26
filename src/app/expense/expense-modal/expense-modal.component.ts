import { Component, inject, Input } from '@angular/core';
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
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Expense } from 'src/app/shared/domain';

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
    IonDatetime,
    IonDatetimeButton,
  ]
})
export default class ExpenseModalComponent {
  // DI
  private readonly modalCtrl = inject(ModalController);
  private readonly fb = inject(FormBuilder);

  // Lifecycle

  constructor() {
    // Add all used Ionic icons
    addIcons({ close, save, text, pricetag, add, cash, calendar, trash });
  }

  // Actions

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save(): void {
    this.modalCtrl.dismiss(null, 'save');
  }

  delete(): void {
    this.modalCtrl.dismiss(null, 'delete');
  }

  add(): void {
    this.modalCtrl.dismiss(null, 'new');
  }


  async showCategoryModal(): Promise<void> {
    const categoryModal = await this.modalCtrl.create({ component: CategoryModalComponent });
    categoryModal.present();
    const { role } = await categoryModal.onWillDismiss();
    console.log('role', role);
  }

  @Input() expense?:Expense;

  readonly form = this.fb.nonNullable.group({
    name: ['name', [Validators.required, Validators.maxLength(40)]],
    category: [1],
    amount: [123.45],
    date: ['2026-10-26'],
  });
}
