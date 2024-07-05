import { Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest, filter, interval, map, of } from "rxjs";
import { JobStatus, JobType } from "~/app/api/mmli-backend/v1";
import { JobResult } from "~/app/models/job-result";
import { NovostoicService } from "~/app/services/novostoic.service";

const estimatedTimeMap = {
  [JobType.NovostoicOptstoic]: 30 * 60,
  [JobType.NovostoicPathways]: 6 * 60 * 60,
  [JobType.NovostoicEnzrank]: 5 * 60,
  [JobType.NovostoicDgpredictor]: 10 * 60
}

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
  host: {
    class: "grow",
  },
})
export class LoadingComponent extends JobResult implements OnInit {
  @Input() override jobType: JobType;

  override jobId: string = this.route.snapshot.paramMap.get("id") || "";

  estimatedTime: number;
  estimatedTimeString: string;
  showError$ = new BehaviorSubject(false);

  form = new FormGroup({
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.required, Validators.email]),
  });

  value$ = combineLatest([
    this.statusResponse$,
    interval(1000),
  ]).pipe(
    map(([status, _]) => {
      //TODO: queued job should return 0, wait for backend to fix the status error
      switch (status.phase) {

        case JobStatus.Queued:
        case JobStatus.Processing:
          const jobStartedMs = (status.time_created || 0) * 1000; // use created time for estimation for now
          const jobElapsedMs = Date.now() - jobStartedMs;
          const coe = 2 / 5;
          const estimatedMs = this.estimatedTime * 1000;
          const decimalTime = (jobElapsedMs % estimatedMs) / estimatedMs;
          const wholeTime = Math.floor(jobElapsedMs / estimatedMs);

          let sum = 0;
          let i = 1;
          while (i < wholeTime && wholeTime >= 1) {
            sum += Math.pow(coe, i);
            i++;
          }
          sum += Math.pow(coe, i) * decimalTime;
          return sum * 100;

        case JobStatus.Completed:
          return 100;

        case JobStatus.Error:
          this.showError$.next(true);
          return 0;
      }
      return 0;
    }
  ))

  constructor(
    private route: ActivatedRoute,
    private novostoicService: NovostoicService,
  ) {
    super(novostoicService);
  }

  ngOnInit(): void {
    this.estimatedTime = estimatedTimeMap[this.jobType];

    const hours = Math.floor(this.estimatedTime / 3600);
    const minutes = Math.floor((this.estimatedTime % 3600) / 60);
    let resultString = '';
    if (hours > 0) {
      resultString += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      resultString += `${resultString.length > 0 ? ' ' : ''}${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    this.estimatedTimeString = resultString;
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    
    this.novostoicService.updateSubscriberEmail(
      this.jobType,
      this.jobId, 
      this.form.controls["subscriberEmail"].value || ''
    );
  }
}
