import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest, filter, first, last, map, of, skipUntil, switchMap, take, takeWhile, tap, throttleTime, timer } from "rxjs";
import { JobType, JobStatus } from "~/app/api/mmli-backend/v1";
import { PathwaySearchResponse } from "~/app/models/pathway-search";
import { NovostoicService } from "~/app/services/novostoic.service";

@Component({
  selector: "app-pathway-search-result",
  templateUrl: "./pathway-search-result.component.html",
  styleUrls: ["./pathway-search-result.component.scss"],
  host: {
    class: "grow",
  },
})
export class PathwaySearchResultComponent implements OnInit {
  loading = false;
  showRightBoundaryLine$ = new BehaviorSubject(false);

  jobId: string = this.route.snapshot.paramMap.get("id") || "";

  statusResponse$ = timer(0, 10000).pipe(
    switchMap(() => this.novostoicService.getResultStatus(
      JobType.NovostoicNovostoic,
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
    switchMap(() => this.novostoicService.getResult(JobType.NovostoicNovostoic, this.jobId)),
    tap((data) => { console.log('result: ', data) }),
    switchMap((data) => of(PathwaySearchResponse.example)), //TODO: replace with actual response
    tap((data) => console.log('response', data))
  );


  visible$ = new BehaviorSubject(false);
  selectedPathway$ = new BehaviorSubject(0);

  pathwayDeltaGs$ = this.response$.pipe(
    map((response) => response.pathways.map((pathway) => pathway.reduce((p, v) => p + v.deltaG, 0))),
  );

  pathwayPredictedReactions$ = this.response$.pipe(
    map((response) => response.pathways.map((pathway) => pathway.filter((reaction) => reaction.isPrediction))),
  );

  maxPathwayStepsTemplateArray$ = this.response$.pipe(
    map((response) => {
      const maxPathwaySteps = response.pathways.reduce(
        (p, v) => Math.max(p, v.length),
        0,
      );
      const array = [];
      for (let i = 0; i < maxPathwaySteps; i++) {
        array.push(i + 1);
      }
      return array;
    }),
  );

  emptyPathwayHeadersArray$ = this.maxPathwayStepsTemplateArray$.pipe(
    map((x) => x.length),
    map((length) => {
      const lengthNeeded = Math.max(0, 4 - length);
      return new Array(lengthNeeded).fill(0);
    }),
  );

  emptyPathwayStepsArrays$ = combineLatest([
    this.maxPathwayStepsTemplateArray$.pipe(map((x) => x.length)),
    this.response$,
  ]).pipe(
    map(([maxArrayLength, response]) => {
      let returnVal: Array<Array<number>> = [];
      let maxLength = Math.max(maxArrayLength, 4);
      response.pathways.forEach((pathway) => {
        const numSlotsNeeded = maxLength - pathway.length;
        const slots = new Array(numSlotsNeeded * 2).fill(0);
        returnVal.push(slots);
      });
      return returnVal;
    }),
  );

  tableStyle$ = combineLatest([
    this.maxPathwayStepsTemplateArray$.pipe(map((x) => x.length)),
    this.response$,
  ]).pipe(
    tap(([maxArrayLength, response]) => {
      if (maxArrayLength && response.pathways.length) {
        this.showRightBoundaryLine$.next(true);
      }
    }),
    map(([maxArrayLength, response]) => {
      return {
        height: `${response.pathways.length * 120}px`,
        width: `${Math.max(maxArrayLength, 4) * 190 - 79.5}px`,
        background:
          "repeat center/2rem url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23efefef' d='m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z'/%3E%3C/svg%3E\")",
      };
    }),
  );

  constructor(
    private novostoicService: NovostoicService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }
}
