import { Component, OnInit, ViewChild } from "@angular/core";
import { FilterService } from "primeng/api";
import { Table } from "primeng/table";
import { BehaviorSubject, map } from "rxjs";
import {
  NovostoicMolecule,
  OverallStoichiometryResponse,
} from "~/app/models/overall-stoichiometry";

@Component({
  selector: "app-overall-stoichiometry-result",
  templateUrl: "./overall-stoichiometry-result.component.html",
  styleUrls: ["./overall-stoichiometry-result.component.scss"],
  host: {
    class: "grow",
  },
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

  response = OverallStoichiometryResponse.example;

  scrollingCounter$ = new BehaviorSubject(-1);
  showResultsFilter$ = new BehaviorSubject(false);
  selectedMoleculeRepresentation$ = new BehaviorSubject(
    this.moleculeRepresentations[0].value,
  );

  filters$ = new BehaviorSubject<NovostoicMolecule[]>([]);
  filterOptions = this.response.results
    .map((result) => [
      ...result.stoichiometry.reactants.map((reactant) => reactant.molecule),
      ...result.stoichiometry.products.map((product) => product.molecule),
    ])
    .flat();
  filterValueStr$ = this.filters$.pipe(
    map((filters) => filters.map((filter) => filter.commonNames[0]).join(",")),
  );

  // example job info
  jobId = "exampleJobId";
  submissionTime = "example submission time";
  loading = true;

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
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

  startScrolling(container: HTMLElement, delta: number) {
    const timeoutId = setTimeout(() => {
      container.scrollLeft += delta;
      this.startScrolling(container, delta);
    }, 1);
    this.scrollingCounter$.next(timeoutId as unknown as number);
  }

  endScrolling() {
    clearTimeout(this.scrollingCounter$.value);
    this.scrollingCounter$.next(-1);
  }

  applyFilters() {
    this.resultsTable.filter(
      this.filters$.value,
      "stoichiometry",
      "containsMolecule",
    );
  }
}
