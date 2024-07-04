import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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

  response$ = this.jobResultResponse$.pipe(
    map((data) => ({
      primaryPrecursor: data.primaryPrecursor,
      enzymeSequence: data.results[0].enzymeSequence,
      activityScore: data.results[0].activityScore,
    })),
  )

  constructor(
    private route: ActivatedRoute,
    private novostoicService: NovostoicService,
  ) {
    super(novostoicService);
  }

  exportCSV() {
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
