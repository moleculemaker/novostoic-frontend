import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { EnzymeSelectionRequest } from "~/app/models/enz-rank";
import { NovostoicService } from "~/app/services/novostoic.service";

@Component({
  selector: "app-enz-rank",
  templateUrl: "./enz-rank.component.html",
  styleUrls: ["./enz-rank.component.scss"],
  host: {
    class: 'grow'
  }
})
export class EnzRankComponent {
  request = new EnzymeSelectionRequest();

  constructor(
    private router: Router, 
    private novostoicService: NovostoicService
  ) {}

  useExample() {
    this.request = EnzymeSelectionRequest.example();
  }

  onSubmit() {
    if (!this.request.form.valid) {
      return;
    }

    this.novostoicService.createJobAndRunEnzrank(
      this.request.toRequestBody()
    ).subscribe((response) => {
      this.router.navigate([NovostoicTools.ENZYME_ACTIVITY, "result", response.jobId]);
    });
  }
}
