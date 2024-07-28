import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest, filter, forkJoin, map, of, switchMap, take, tap } from "rxjs";
import { JobType } from "~/app/api/mmli-backend/v1";
import { JobResult } from "~/app/models/job-result";
import { NovostoicService } from "~/app/services/novostoic.service";

@Component({
  selector: "app-dg-predictor-result",
  templateUrl: "./dg-predictor-result.component.html",
  styleUrls: ["./dg-predictor-result.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class DgPredictorResultComponent extends JobResult {
  override jobId: string = this.route.snapshot.paramMap.get("id") || "";
  override jobType: JobType = JobType.NovostoicDgpredictor;

  columnsForExport = [
    { field: "reaction", header: "Reaction" },
    {
      field: "gibbsEnergy",
      header: "Gibbs Free Energy(kJ/mol)",
    },
  ];

  response$ = this.jobResultResponse$.pipe(
    map((data) => data.map((d: any, i: number) => ({ 
      ...d, 
      id: i,
      reactants: Object.values(d.molecules)
        .filter((val: any) => val['amount'] < 0)
        .sort((a: any, b: any) => a['is_cofactor'] ? 1 : b['is_cofactor'] ? -1 : 0),
      products: Object.values(d.molecules)
        .filter((val: any) => val['amount'] > 0)
        .sort((a: any, b: any) => a['is_cofactor'] ? -1 : b['is_cofactor'] ? 1 : 0),
    }))),
    tap(console.log)
  );

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
