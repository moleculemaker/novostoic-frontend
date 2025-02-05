import { timer, switchMap, tap, takeWhile, BehaviorSubject, skipUntil, filter, map, delay, shareReplay, share, combineLatest } from "rxjs";
import { JobStatus, JobType } from "../api/mmli-backend/v1";
import { NovostoicService } from "../services/novostoic.service";

export class JobResult {
    jobId: string;
    jobType: JobType;
    jobInfo: any;

    isLoading$ = new BehaviorSubject(true);
    resultLoaded$ = new BehaviorSubject(false);

    statusResponse$ = timer(0, 10000).pipe(
        switchMap(() => this.service.getResultStatus(
            this.jobType,
            this.jobId,
        )),
        tap(() => this.resultLoaded$.value ? null : this.isLoading$.next(true)),
        takeWhile((data) =>
            data.phase === JobStatus.Processing
            || data.phase === JobStatus.Queued
            , true),
        tap((data) => { console.log('job status: ', data) }),
    );

    jobResultResponse$ = this.statusResponse$.pipe(
        skipUntil(this.statusResponse$.pipe(
            filter((job) => job.phase === JobStatus.Completed),
            tap((job) => this.jobInfo = JSON.parse(job.job_info || '{}')),
        )),
        switchMap(() => this.service.getResult(this.jobType, this.jobId)),
        delay(1000),
        tap(() => this.isLoading$.next(false)),
        tap(() => this.resultLoaded$.next(true)),
        tap((data) => { console.log('result: ', data) }),
        shareReplay(1),
    );

    constructor(
        private service: NovostoicService,
    ) { }
}