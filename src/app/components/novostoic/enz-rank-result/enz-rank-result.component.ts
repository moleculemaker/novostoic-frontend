import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Table } from "primeng/table";
import { timer, switchMap, takeWhile, tap, map, skipUntil, filter, of, BehaviorSubject, interval } from "rxjs";
import { JobType, JobStatus } from "~/app/api/mmli-backend/v1";
import { JobResult } from "~/app/models/job-result";
import { NovostoicService } from "~/app/services/novostoic.service";

@Component({
  selector: "app-enz-rank-result",
  templateUrl: "./enz-rank-result.component.html",
  styleUrls: ["./enz-rank-result.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class EnzRankResultComponent extends JobResult {
  override jobId: string = this.route.snapshot.paramMap.get("id") || "";
  override jobType: JobType = JobType.NovostoicEnzrank;

  @ViewChild('resultsTable') resultsTable!: Table;

  response$ = this.jobResultResponse$.pipe(
    map((data) => ({
      primaryPrecursor: data.primaryPrecursor,
      results: data.results.map((result: { activityScore: number, enzymeSequence: string }) => ({
        ...result,
        enzymeSequence: 'user_input_map' in this.jobInfo 
          ? this.jobInfo.user_input_map[result.enzymeSequence] 
          : result.enzymeSequence,
        color: result.activityScore > 0.66 
          ? '#2152CE' 
          : (result.activityScore > 0.33 
            ? '#7FC9EF' 
            : '#F2D066'),
        iid: Math.random().toString(36).substring(2, 15),
      })),
    })),
  )

  columnsForExport = [
    { field: 'enzymeSequence', header: 'Enzyme Input' },
    { field: 'activityScore', header: 'Activity Score' },
  ];

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
