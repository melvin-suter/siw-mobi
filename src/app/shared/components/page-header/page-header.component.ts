import { Component, Input, OnInit } from '@angular/core';
import { IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.component.html',
  imports: [
    IonHeader,
    IonMenuButton,
    IonButtons,
    IonTitle,
    IonToolbar,
  ],
})
export class PageHeaderComponent  implements OnInit {

  @Input() page_title:string = "";

  constructor() { }

  ngOnInit() {}

}
