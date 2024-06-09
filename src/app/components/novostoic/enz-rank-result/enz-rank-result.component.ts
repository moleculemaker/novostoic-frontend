import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { timer, switchMap, takeWhile, tap, map, skipUntil, filter, of, BehaviorSubject } from "rxjs";
import { JobType, JobStatus } from "~/app/api/mmli-backend/v1";
import { NovostoicService } from "~/app/services/novostoic.service";

@Component({
  selector: "app-enz-rank-result",
  templateUrl: "./enz-rank-result.component.html",
  styleUrls: ["./enz-rank-result.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class EnzRankResultComponent {
  jobId: string = this.route.snapshot.paramMap.get("id") || "";

  statusResponse$ = timer(0, 10000).pipe(
    switchMap(() => this.novostoicService.getResultStatus(
      JobType.NovostoicEnzrank,
      this.jobId,
    )),
    tap(() => this.isLoading$.next(true)),
    takeWhile((data) => 
      data.phase === JobStatus.Processing 
      || data.phase === JobStatus.Queued
    , true),
    tap((data) => { console.log('job status: ', data) }),
  );

  isLoading$ = new BehaviorSubject(true);

  response$ = this.statusResponse$.pipe(
    skipUntil(this.statusResponse$.pipe(filter((job) => job.phase === JobStatus.Completed))),
    switchMap(() => this.novostoicService.getResult(JobType.NovostoicEnzrank, this.jobId)),
    map((data) => ({
      primaryPrecursor: data.primaryPrecursor,
      enzymeSequence: data.results[0].enzymeSequence,
      activityScore: data.results[0].activityScore,
    })),
    tap(() => this.isLoading$.next(true)),
    tap((data) => { console.log('result: ', data) }),
  );

  constructor(
    private route: ActivatedRoute,
    private novostoicService: NovostoicService,
  ) {}

  exportCSV() {
  }
}
