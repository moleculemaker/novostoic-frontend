import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { ThermodynamicalFeasibilityRequest } from "~/app/models/dg-predictor";
import { NovostoicService } from "~/app/services/novostoic.service";

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

  constructor(
    private router: Router, 
    private novostoicService: NovostoicService
  ) {}

  onSubmit() {
    if (!this.request.form.valid) {
      return;
    }

    this.novostoicService.createJobAndRunDgpredictor(
      this.request.toRequestBody()
    ).subscribe((response) => {
      this.router.navigate([NovostoicTools.THERMODYNAMICAL_FEASIBILITY, "result", response.jobId]);
    });
  }

  useExampleRequest() {
    this.request = new ThermodynamicalFeasibilityRequest().exampleRequest();
  }
}
