import { Component } from "@angular/core";
import { BehaviorSubject } from "rxjs";

enum ActiveAboutPanel {
  ABOUT,
  GITHUB,
  PUBLICATIONS,
  GET_INVOLVED,
}

@Component({
  selector: "app-about-novostoic",
  templateUrl: "./about-novostoic.component.html",
  styleUrls: ["./about-novostoic.component.scss"],
  host: {
    class: "w-full",
  }
})
export class AboutNovostoicComponent {
  readonly ActiveAboutPanel = ActiveAboutPanel;

  activePanel$ = new BehaviorSubject(ActiveAboutPanel.ABOUT);
}
