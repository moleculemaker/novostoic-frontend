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

@Component({
  selector: "app-overall-stoichiometry-result",
  templateUrl: "./overall-stoichiometry-result.component.html",
  styleUrls: ["./overall-stoichiometry-result.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class OverallStoichiometryResultComponent implements OnInit {
  @ViewChild("resultsTable") resultsTable: Table;

  moleculeRepresentations: Array<{
    label: string;
    value: "smiles" | "commonNames" | "keggId";
  }> = [
    {
      label: "SMILES",
      value: "smiles",
    },
    {
      label: "Common Name",
      value: "commonNames",
    },
    {
      label: "Kegg ID",
      value: "keggId",
    },
  ];

  jobId: string = this.route.snapshot.paramMap.get("id") || "";

  statusResponse$ = timer(0, 10000).pipe(
    switchMap(() => this.novostoicService.getResultStatus(
      JobType.NovostoicOptstoic,
      this.jobId,
    )),
    takeWhile((data) => 
      data.phase === JobStatus.Processing 
      || data.phase === JobStatus.Queued
    , true),
    tap((data) => { console.log('job status: ', data) }),
  );

  isLoading$ = this.statusResponse$.pipe(
    map((job) => job.phase === JobStatus.Processing || job.phase === JobStatus.Queued),
  );

  response$ = this.statusResponse$.pipe(
    skipUntil(this.statusResponse$.pipe(filter((job) => job.phase === JobStatus.Completed))),
    switchMap(() => this.novostoicService.getResult(JobType.NovostoicOptstoic, this.jobId)),
    tap((data) => { console.log('result: ', data) }),
    switchMap((data) => of(OverallStoichiometryResponse.example)), //TODO: replace with actual response
  );

  showResultsFilter$ = new BehaviorSubject(false);
  selectedMoleculeRepresentation$ = new BehaviorSubject(
    this.moleculeRepresentations[0].value,
  );

  filters$ = new BehaviorSubject<NovostoicMolecule[]>([]);
  filterOptions$ = this.response$.pipe(map(({ results }) => results.map((result) => [
    ...result.stoichiometry.reactants.map((reactant) => reactant.molecule),
    ...result.stoichiometry.products.map((product) => product.molecule),
  ]).flat()))
  filterValueStr$ = this.filters$.pipe(
    map((filters) => filters.map((filter) => filter.commonNames[0]).join(",")),
  );

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private filterService: FilterService,
    private novostoicService: NovostoicService,
  ) {}

  ngOnInit(): void {
    this.filterService.register(
      "containsMolecule",
      (
        value: OverallStoichiometryResponse["results"][0]["stoichiometry"],
        filter: NovostoicMolecule[],
      ) => {
        const isSameMolecule = (m1: NovostoicMolecule, m2: NovostoicMolecule) =>
          m1.smiles === m2.smiles ||
          m1.keggId === m2.keggId ||
          m1.commonNames.some((name) => m2.commonNames.includes(name));
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
}
