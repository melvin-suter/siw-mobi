import { Component, Input, OnInit } from '@angular/core';
import { IonButtons, IonHeader, IonMenuButton, IonProgressBar, IonTitle, IonToolbar } from '@ionic/angular/standalone';

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
    IonProgressBar,
  ],
})
export class PageHeaderComponent  implements OnInit {

  @Input() loading:boolean = false;
  @Input() page_title:string = "";

  constructor() { }

  ngOnInit() {}

}
