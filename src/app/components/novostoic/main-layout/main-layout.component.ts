import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  host: {
    class: 'grow flex h-full max-w-screen-xl gap-16'
  }
})
export class MainLayoutComponent {

}
