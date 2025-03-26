import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap, tap } from 'rxjs';

import { PostResponse } from '../models';
import {
  DefaultService,
  JobsService,
  FilesService,
  NovostoicService as NovostoicApiService,
  JobType,
  ChemicalAutoCompleteResponse,
  BodyCreateJobJobTypeJobsPost,
  Job
} from "../api/mmli-backend/v1";

export type LoadingStatus = 'loading' | 'loaded' | 'error' | 'na' | 'invalid' | 'empty';

export type Loadable<T> = {
  status: LoadingStatus;
  error?: string;
  data: T | null;
}

@Injectable({
  providedIn: 'root'
})
export class NovostoicService {

  responseFromExample: PostResponse = {
    jobId: "example_optstoic_job_id",
    submitted_at: "2020-01-01 10:10:10"
  };

  readonly thermoFeasibilityFilterMax = 1000;
  readonly thermoFeasibilityFilterMin = -8000;

  constructor(
    private apiService: DefaultService,

    private jobsService: JobsService,
    private filesService: FilesService,
    private novostoicService: NovostoicApiService,
  ) {  }

  getExampleResponse(dataLabel: string): Observable<PostResponse>{
    this.responseFromExample.jobId = dataLabel;
    const respond = of(this.responseFromExample);
    return respond;
  }

  createJobAndRun(jobType: JobType, requestBody: BodyCreateJobJobTypeJobsPost): Observable<Job> {
    return this.jobsService.createJobJobTypeJobsPost(jobType, requestBody);
  }

  getResultStatus(jobType: JobType, jobID: string): Observable<Job>{
    return this.jobsService.listJobsByTypeAndJobIdJobTypeJobsJobIdGet(jobType, jobID)
      .pipe(map((response) => response[0]));
  }

  getResult(jobType: JobType, jobID: string): Observable<any>{
    return this.filesService.getResultsBucketNameResultsJobIdGet(jobType, jobID);
  }

  getError(jobType: JobType, jobID: string): Observable<string>{
    return this.filesService.getErrorsBucketNameErrorsJobIdGet(jobType, jobID);
  }

  getChemicalAutoComplete(searchString: string): Observable<ChemicalAutoCompleteResponse[]>{
    return this.novostoicService.getChemicalAutoCompleteChemicalAutoCompleteGet(searchString);
  }

  validateChemical(searchString: string): Observable<Loadable<ChemicalAutoCompleteResponse>> {
    return new Observable((observer) => {
      observer.next({ status: 'loading', data: null });

      const subscription = this.novostoicService.validateChemicalChemicalValidateGet(searchString).pipe(
        map((res) => {
          return res;
        })
      ).subscribe({
        next: (res) => {
          if (!res) {
            observer.next({ status: 'invalid', error: 'Chemical not supported', data: null });
          } else {
            observer.next({ status: 'loaded', data: res });
          }
          observer.complete();
        },
        error: (err) => {
          observer.next({ status: 'error', error: err.message, data: null });
          observer.complete();
        }
      });

      return () => subscription.unsubscribe();
    });
  }
}
