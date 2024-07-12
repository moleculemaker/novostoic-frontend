import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, filter, map, of, skipUntil, switchMap, takeWhile, tap, timer } from "rxjs";
import { JobType, JobStatus } from "~/app/api/mmli-backend/v1";
import { ThermodynamicalFeasibilityResponse } from "~/app/models/dg-predictor";
import { JobResult } from "~/app/models/job-result";
import { NovostoicService } from "~/app/services/novostoic.service";

@Component({
  selector: "app-dg-predictor-result",
  templateUrl: "./dg-predictor-result.component.html",
  styleUrls: ["./dg-predictor-result.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class DgPredictorResultComponent extends JobResult {
  override jobId: string = this.route.snapshot.paramMap.get("id") || "";
  override jobType: JobType = JobType.NovostoicDgpredictor;

  columnsForExport = [
    { field: "reaction", header: "Reaction" },
    {
      field: "gibbsEnergy",
      header: "Gibbs Free Energy(kJ/mol)",
    },
  ];

  response$ = this.jobResultResponse$.pipe(
    map((data) => data.map((d: any, i: number) => ({ ...d, index: i + 1 }))),
  );

  constructor(
    private route: ActivatedRoute,
    private novostoicService: NovostoicService,
  ) {
    super(novostoicService);
  }

  copyAndPasteURL(): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = window.location.href;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
