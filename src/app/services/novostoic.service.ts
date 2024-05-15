import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';

import { PostResponse, Job } from '../models';
import {
  DefaultService,
  //Molecule,
  //ExportRequestBody,
  JobsService,
  FilesService,
  NovostoicService as NovostoicApiService,
  OptstoicRequestBody,
  JobCreate,
  JobType,
  NovostoicRequestBody,
  DgPredictorRequestBody,
  EnzRankRequestBody,
  ChemicalAutoCompleteResponse
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
    return this.createJobAndRun(requestBody, JobType.NovostoicOptstoic);
  }

  createJobAndRunPathwaySearch(requestBody: NovostoicRequestBody): Observable<PostResponse> {
    return this.createJobAndRun(requestBody, JobType.NovostoicNovostoic);
  }

  createJobAndRunDgpredictor(requestBody: DgPredictorRequestBody): Observable<PostResponse> {
    return this.createJobAndRun(requestBody, JobType.NovostoicDgpredictor);
  }

  createJobAndRunEnzrank(requestBody: EnzRankRequestBody): Observable<PostResponse> {
    return this.createJobAndRun(requestBody, JobType.NovostoicEnzrank);
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

  private createJobAndRun(requestBody: any, jobType: JobType): Observable<PostResponse>{
    const jobCreate: JobCreate = {
      job_info: JSON.stringify(requestBody),
      email: requestBody.user_email,
    }

    return this.jobsService.createJobJobTypeJobsPost(jobType, jobCreate)
      .pipe(switchMap((response) => {
        console.log('Job created', response);
        requestBody.jobId = response.job_id!;
        switch (jobType) {
          case JobType.NovostoicOptstoic:
            return this.novostoicService.startOptstoicNovostoicOptstoicRunPost(requestBody);
          case JobType.NovostoicNovostoic:
            return this.novostoicService.startNovostoicNovostoicNovostoicRunPost(requestBody);
          case JobType.NovostoicDgpredictor:
            return this.novostoicService.startDgpredictorNovostoicDgpredictorRunPost(requestBody);
          case JobType.NovostoicEnzrank:
            return this.novostoicService.startEnzrankNovostoicEnzrankRunPost(requestBody);
          default:
            return of({ jobId: "example_job_id", submitted_at: "2020-01-01 10:10:10" });
        }
      }))
  }
}
