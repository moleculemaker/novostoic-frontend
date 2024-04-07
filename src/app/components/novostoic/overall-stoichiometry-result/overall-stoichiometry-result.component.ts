import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FilterService } from "primeng/api";
import { Table } from "primeng/table";
import { BehaviorSubject, Observable, filter, map, of, shareReplay, switchMap, takeUntil, takeWhile, tap, timer } from "rxjs";

import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { JobType } from "~/app/api/mmli-backend/v1";
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

  jobId: string;
  submissionTime = "example submission time";
  loading = false;

  pollForResult$ = new BehaviorSubject(true);

  statusResponse$ = timer(0, 10000).pipe(
    switchMap(() => this.novostoicService.getResultStatus(
      JobType.NovostoicOptstoic,
      this.jobId,
    )),
    takeUntil(this.pollForResult$.pipe(filter(poll => !poll))),
    tap((jobStatus) => {
      console.log(jobStatus);
    })
  );

  response$ = this.statusResponse$.pipe(
    filter(jobStatus => jobStatus.phase == "completed"),
    switchMap(() => this.novostoicService.getResult(
      JobType.NovostoicOptstoic,
      this.jobId
    )),
    tap((data) => { console.log(data) }),
    switchMap((data) => of(OverallStoichiometryResponse.example)),
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

  constructor(
    private route: ActivatedRoute,
    private filterService: FilterService,
    private novostoicService: NovostoicService,
  ) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get("id")!;
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

  enterPathwayDesignByClick(stoichiometry: NovostoicStoichiometry) {
    // const state = {
    //   primaryPrecursor: this.response.primaryPrecursor,
    //   targetMolecule: this.response.targetMolecule,
    //   stoichiometry,
    // };
    // this.router.navigate([NovostoicTools.PATHWAY_SEARCH], { state });
  }

  applyFilters() {
    this.resultsTable.filter(
      this.filters$.value,
      "stoichiometry",
      "containsMolecule",
    );
  }
}
