import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { ThermodynamicalFeasibilityRequest } from "~/app/models/dg-predictor";

@Component({
  selector: "app-dg-predictor",
  templateUrl: "./dg-predictor.component.html",
  styleUrls: ["./dg-predictor.component.scss"],
})
export class DgPredictorComponent {
  request = new ThermodynamicalFeasibilityRequest();
  showDialog$ = new BehaviorSubject(false);

  reactionTypeInput$ =
    this.request.form.controls["reactionInputType"].valueChanges;

  constructor(private router: Router) {}

  onSubmit(request: ThermodynamicalFeasibilityRequest) {
    this.router.navigate([NovostoicTools.THERMODYNAMICAL_FEASIBILITY, "result"]);
  }

  useExampleRequest() {
    this.request = new ThermodynamicalFeasibilityRequest().exampleRequest();
  }
}
