import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, save, text, trash } from 'ionicons/icons';

export interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonIcon,
    IonFab,
    IonFabButton,

  ],
})
export default class CategoryModalComponent implements OnInit {
  // DI
  private readonly modalCtrl = inject(ModalController);
  private readonly fb = inject(FormBuilder);

  // Input
  @Input() category?: Category;

  // Form
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(40)]],
  });

  constructor() {
    addIcons({ close, save, text, trash });
  }

  ngOnInit(): void {
    console.log('category received:', this.category);

    if (this.category) {
      this.form.patchValue({ name: this.category.name });
    }
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  add(): void {
    if (this.form.invalid) return;
    this.modalCtrl.dismiss({ ...this.category, ...this.form.getRawValue() }, 'add');
  }

  save(): void {
    if (this.form.invalid) return;
    this.modalCtrl.dismiss({ ...this.category, ...this.form.getRawValue() }, 'save');
  }

  delete(): void {
    this.modalCtrl.dismiss(this.category, 'delete');
  }
}