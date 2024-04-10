import { Component } from '@angular/core';

@Component({
  selector: 'app-center-layout',
  templateUrl: './center-layout.component.html',
  styleUrls: ['./center-layout.component.scss'],
  host: {
    class: 'flex h-full justify-center w-full grow'
  }
})
export class CenterLayoutComponent {

}
