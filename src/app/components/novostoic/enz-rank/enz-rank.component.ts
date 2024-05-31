import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { JobType } from "~/app/api/mmli-backend/v1";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { EnzymeSelectionRequest } from "~/app/models/enz-rank";
import { NovostoicService } from "~/app/services/novostoic.service";

@Component({
  selector: "app-enz-rank",
  templateUrl: "./enz-rank.component.html",
  styleUrls: ["./enz-rank.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
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

    this.novostoicService.createJobAndRun(
      JobType.NovostoicEnzrank,
      this.request.toRequestBody()
    ).subscribe((response) => {
      this.router.navigate([NovostoicTools.ENZYME_ACTIVITY, "result", response.job_id]);
    });
  }
}
