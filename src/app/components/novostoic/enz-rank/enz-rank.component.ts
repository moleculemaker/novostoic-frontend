import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { EnzymeSelectionRequest } from "~/app/models/enz-rank";

@Component({
  selector: "app-enz-rank",
  templateUrl: "./enz-rank.component.html",
  styleUrls: ["./enz-rank.component.scss"],
  host: {
    class: "grow",
  },
})
export class EnzRankComponent {
  request = new EnzymeSelectionRequest();

  constructor(private router: Router) {}

  useExample() {
    this.request = EnzymeSelectionRequest.example();
  }

  onSubmit(request: EnzymeSelectionRequest) {
    this.router.navigate(["/enzyme-selection/result"]);
  }
}
