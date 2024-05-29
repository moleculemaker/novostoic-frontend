import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { filter, map, of, skipUntil, switchMap, takeWhile, tap, timer } from "rxjs";
import { JobType, JobStatus } from "~/app/api/mmli-backend/v1";
import { ThermodynamicalFeasibilityResponse } from "~/app/models/dg-predictor";
import { NovostoicService } from "~/app/services/novostoic.service";

@Component({
  selector: "app-dg-predictor-result",
  templateUrl: "./dg-predictor-result.component.html",
  styleUrls: ["./dg-predictor-result.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class DgPredictorResultComponent {
  columnsForExport = [
    { field: "reaction", header: "Reaction" },
    {
      field: "gibbsEnergy",
      header: "Gibbs Free Energy(kJ/mol)",
    },
  ];

  jobId: string = this.route.snapshot.paramMap.get("id") || "";

  statusResponse$ = timer(0, 10000).pipe(
    switchMap(() => this.novostoicService.getResultStatus(
      JobType.NovostoicDgpredictor,
      this.jobId,
    )),
    takeWhile((data) => 
      data.phase === JobStatus.Processing 
      || data.phase === JobStatus.Queued
    , true),
    tap((data) => { console.log('job status: ', data) }),
  );

  isLoading$ = this.statusResponse$.pipe(
    map((job) => job.phase === JobStatus.Processing || job.phase === JobStatus.Queued),
  );

  response$ = this.statusResponse$.pipe(
    skipUntil(this.statusResponse$.pipe(filter((job) => job.phase === JobStatus.Completed))),
    switchMap(() => this.novostoicService.getResult(JobType.NovostoicDgpredictor, this.jobId)),
    tap((data) => { console.log('result: ', data) }),
    switchMap((data) => of(ThermodynamicalFeasibilityResponse.example)), //TODO: replace with actual response
  );

  constructor(
    private route: ActivatedRoute,
    private novostoicService: NovostoicService,
  ) {}
}
