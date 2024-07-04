import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FilterService } from "primeng/api";
import { Table } from "primeng/table";
import { BehaviorSubject, Observable, Subscription, filter, map, of, shareReplay, skipUntil, switchMap, take, takeLast, takeUntil, takeWhile, tap, timer } from "rxjs";

import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { JobStatus, JobType, JobsService } from "~/app/api/mmli-backend/v1";
import {
  NovostoicMolecule,
  NovostoicStoichiometry,
  OverallStoichiometryResponse,
} from "~/app/models/overall-stoichiometry";
import { NovostoicService } from "~/app/services/novostoic.service";
import { JobResult } from "~/app/models/job-result";

@Component({
  selector: "app-overall-stoichiometry-result",
  templateUrl: "./overall-stoichiometry-result.component.html",
  styleUrls: ["./overall-stoichiometry-result.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class OverallStoichiometryResultComponent extends JobResult implements OnInit {
  @ViewChild("resultsTable") resultsTable: Table;

  override jobId: string = this.route.snapshot.paramMap.get("id") || "";
  override jobType: JobType = JobType.NovostoicOptstoic;

  response$ = this.jobResultResponse$.pipe(
    map((response) => response as OverallStoichiometryResponse),
  );

  showResultsFilter$ = new BehaviorSubject(false);

  filters$ = new BehaviorSubject<NovostoicMolecule[]>([]);
  filterOptions$ = this.response$.pipe(map(({ results }) => results.map((result) => [
    ...result.stoichiometry.reactants.map((reactant) => reactant.molecule),
    ...result.stoichiometry.products.map((product) => product.molecule),
  ]).flat()))
  filterValueStr$ = this.filters$.pipe(
    map((filters) => filters.map((filter) => filter.name).join(",")),
  );

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private filterService: FilterService,
    private novostoicService: NovostoicService,
  ) {
    super(novostoicService);
  }

  ngOnInit(): void {
    this.filterService.register(
      "containsMolecule",
      (
        value: OverallStoichiometryResponse["results"][0]["stoichiometry"],
        filter: NovostoicMolecule[],
      ) => {
        const isSameMolecule = (m1: NovostoicMolecule, m2: NovostoicMolecule) =>
          m1.smiles === m2.smiles ||
          m1.kegg_id === m2.kegg_id ||
          m1.name === m2.name;
        return (
          value.reactants.some(({ molecule }) =>
            filter.some((m) => isSameMolecule(m, molecule)),
          ) ||
          value.products.some(({ molecule }) =>
            filter.some((m) => isSameMolecule(m, molecule)),
          )
        );
      },
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  enterPathwayDesignByClick(stoichiometry: NovostoicStoichiometry) {
    this.subscriptions.push(
      this.response$.pipe(take(1)).subscribe((response) => {
        const state = {
          primaryPrecursor: response.primaryPrecursor,
          targetMolecule: response.targetMolecule,
          stoichiometry,
        };
        this.router.navigate([NovostoicTools.PATHWAY_SEARCH], { state });
      })
    );
  }

  applyFilters() {
    this.resultsTable.filter(
      this.filters$.value,
      "stoichiometry",
      "containsMolecule",
    );
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
