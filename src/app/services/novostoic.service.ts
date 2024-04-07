import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';

import { PostResponse, ChemScraperAnalyzeRequestBody, ExampleData, FileUploadResponse, ExportRequestBody, Job } from '../models';
import {
  DefaultService,
  //Molecule,
  //ExportRequestBody,
  JobsService,
  FilesService,
  Molecule,
  NovostoicService as NovostoicApiService,
  OptstoicRequestBody,
  JobCreate,
  JobType
} from "../api/mmli-backend/v1";

@Injectable({
  providedIn: 'root'
})
export class NovostoicService {

  responseFromExample: PostResponse = {
    jobId: "example_optstoic_job_id",
    submitted_at: "2020-01-01 10:10:10"
  };

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

  createJobAndRunOptstoic(requestBody: OptstoicRequestBody): Observable<PostResponse>{
    const jobCreate: JobCreate = {
      job_info: JSON.stringify(requestBody),
      email: requestBody.user_email,
    }

    return this.jobsService.createJobJobTypeJobsPost(JobType.NovostoicOptstoic, jobCreate)
      .pipe(switchMap((response) => {
        console.log('Job created', response);
        requestBody.jobId = response.job_id!;
        return this.novostoicService.startOptstoicNovostoicOptstoicRunPost(requestBody)
      }))
  }

  getResultStatus(jobType: JobType, jobID: string): Observable<Job>{
    return this.jobsService.getJobByTypeAndJobIdAndRunIdJobTypeJobsJobIdRunIdGet(jobType, jobID, '0');
  }

  getResult(jobType: JobType, jobID: string): Observable<Molecule[]>{
    return this.filesService.getResultsBucketNameResultsJobIdGet(jobType, jobID);
  }

  getError(jobType: JobType, jobID: string): Observable<string>{
    return this.filesService.getErrorsBucketNameErrorsJobIdGet(jobType, jobID);
  }
}
