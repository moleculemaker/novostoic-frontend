import { Component } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-overall-stoichiometry-result",
  templateUrl: "./overall-stoichiometry-result.component.html",
  styleUrls: ["./overall-stoichiometry-result.component.scss"],
  host: {
    class: "grow",
  },
})
export class OverallStoichiometryResultComponent {
  moleculeRepresentations = [
    {
      label: "SMILES",
      value: "smiles",
    },
    {
      label: "Common Name",
      value: "commonName",
    },
    {
      label: "Kegg ID",
      value: "keggId",
    },
  ];

  results = [
    {
      stoichiometry: {
        reactants: [
          { name: "NADH", amount: 1.0 },
          { name: "NADH", amount: 1.0 },
          { name: "NADH", amount: 1.0 },
          { name: "NADH", amount: 1.0 },
          { name: "NADH", amount: 1.0 },
          { name: "NADH", amount: 1.0 },
          { name: "CO2", amount: 2.0 },
        ],
        yield: [
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "Water", amount: 2.0 },
        ],
      },
      yield: 3.0,
      deltaG: 5,
    },
    {
      stoichiometry: {
        reactants: [
          { name: "NADH", amount: 1.0 },
          { name: "NADH", amount: 1.0 },
          { name: "NADH", amount: 1.0 },
          { name: "NADH", amount: 1.0 },
          { name: "NADH", amount: 1.0 },
          { name: "NADH", amount: 1.0 },
          { name: "CO2", amount: 2.0 },
        ],
        yield: [
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "NAD", amount: 1.5 },
          { name: "Water", amount: 2.0 },
        ],
      },
      yield: 3.0,
      deltaG: 5,
    },
    {
      stoichiometry: {
        reactants: [
          { name: "NADH", amount: 1.0 },
          { name: "CO2", amount: 2.0 },
        ],
        yield: [
          { name: "NAD", amount: 1.5 },
          { name: "Water", amount: 2.0 },
        ],
      },
      yield: 3.0,
      deltaG: 5,
    },
    {
      stoichiometry: {
        reactants: [
          { name: "NADH", amount: 1.0 },
          { name: "CO2", amount: 2.0 },
        ],
        yield: [
          { name: "NAD", amount: 1.5 },
          { name: "Water", amount: 2.0 },
        ],
      },
      yield: 3.0,
      deltaG: 5,
    },
    {
      stoichiometry: {
        reactants: [
          { name: "NADH", amount: 1.0 },
          { name: "CO2", amount: 2.0 },
        ],
        yield: [
          { name: "NAD", amount: 1.5 },
          { name: "Water", amount: 2.0 },
        ],
      },
      yield: 3.0,
      deltaG: 5,
    },
    {
      stoichiometry: {
        reactants: [
          { name: "NADH", amount: 1.0 },
          { name: "CO2", amount: 2.0 },
        ],
        yield: [
          { name: "NAD", amount: 1.5 },
          { name: "Water", amount: 2.0 },
        ],
      },
      yield: 3.0,
      deltaG: 5,
    },
    {
      stoichiometry: {
        reactants: [
          { name: "NADH", amount: 1.0 },
          { name: "CO2", amount: 2.0 },
        ],
        yield: [
          { name: "NAD", amount: 1.5 },
          { name: "Water", amount: 2.0 },
        ],
      },
      yield: 3.0,
      deltaG: 5,
    },
    {
      stoichiometry: {
        reactants: [
          { name: "NADH", amount: 1.0 },
          { name: "CO2", amount: 2.0 },
        ],
        yield: [
          { name: "NAD", amount: 1.5 },
          { name: "Water", amount: 2.0 },
        ],
      },
      yield: 3.0,
      deltaG: 5,
    },
    {
      stoichiometry: {
        reactants: [
          { name: "NADH", amount: 1.0 },
          { name: "CO2", amount: 2.0 },
        ],
        yield: [
          { name: "NAD", amount: 1.5 },
          { name: "Water", amount: 2.0 },
        ],
      },
      yield: 3.0,
      deltaG: 5,
    },
    {
      stoichiometry: {
        reactants: [
          { name: "NADH", amount: 1.0 },
          { name: "CO2", amount: 2.0 },
        ],
        yield: [
          { name: "NAD", amount: 1.5 },
          { name: "Water", amount: 2.0 },
        ],
      },
      yield: 3.0,
      deltaG: 5,
    },
    {
      stoichiometry: {
        reactants: [
          { name: "NADH", amount: 1.0 },
          { name: "CO2", amount: 2.0 },
        ],
        yield: [
          { name: "NAD", amount: 1.5 },
          { name: "Water", amount: 2.0 },
        ],
      },
      yield: 3.0,
      deltaG: 5,
    },
    {
      stoichiometry: {
        reactants: [
          { name: "NADH", amount: 1.0 },
          { name: "CO2", amount: 2.0 },
        ],
        yield: [
          { name: "NAD", amount: 1.5 },
          { name: "Water", amount: 2.0 },
        ],
      },
      yield: 3.0,
      deltaG: 5,
    },
  ];

  scrollingCounter$ = new BehaviorSubject(-1);
  showResultsFilter$ = new BehaviorSubject(false);
  selectedMoleculeRepresentation$ = new BehaviorSubject(
    this.moleculeRepresentations[0],
  );

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
