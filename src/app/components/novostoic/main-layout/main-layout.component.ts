import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  host: {
    class: 'grow flex w-screen max-w-screen'
  }
})
export class MainLayoutComponent {

}
