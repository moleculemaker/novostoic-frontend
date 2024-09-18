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

@Injectable({
  providedIn: 'root'
})
export class NovostoicService {

  responseFromExample: PostResponse = {
    jobId: "example_optstoic_job_id",
    submitted_at: "2020-01-01 10:10:10"
  };

  readonly thermoFeasibilityMax = 50;
  readonly thermoFeasibilityMin = -8000;

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

  validateChemical(searchString: string): Observable<ChemicalAutoCompleteResponse | null> {
    return this.novostoicService.validateChemicalChemicalValidateGet(searchString);
  }
}
