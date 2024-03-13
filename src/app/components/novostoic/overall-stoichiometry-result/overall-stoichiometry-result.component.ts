import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
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

  // example job info
  jobId = "exampleJobId";
  submissionTime = "example submission time";
  loading = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
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
}
