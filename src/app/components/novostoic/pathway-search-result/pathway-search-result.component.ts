import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-pathway-search-result",
  templateUrl: "./pathway-search-result.component.html",
  styleUrls: ["./pathway-search-result.component.scss"],
  host: {
    class: "grow",
  },
})
export class PathwaySearchResultComponent implements OnInit {
  jobId = "exampleJobId";
  submissionTime = "example submission time";
  loading = false;
  scrollingCounter$ = new BehaviorSubject(-1);

  primaryPrecursor$ = new BehaviorSubject({
    smiles: "ex consequat sit adipisicing commodo",
    commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
    keggId: "proident",
    structure: "",
  });
  targetMolecule$ = new BehaviorSubject({
    smiles: "sint fugiat Ut",
    commonNames: [
      "minim fugiat pariatur deserunt Ut",
      "exercitation Ut",
      "Duis est nostrud",
    ],
    keggId: "laborum dolor magna",
  });
  stoichiometry$ = new BehaviorSubject({
    reactants: [
      {
        molecule: {
          commonNames: [
            "tempor in dolore aute sint",
            "incididunt dolor qui in magna",
            "anim incididunt officia",
          ],
          smiles: "proident aute sint",
          keggId: "nostrud aute ipsum proident sit",
          structure: "",
        },
        amount: 10.312100871722501,
      },
    ],
    products: [
      {
        molecule: {
          commonNames: ["enim aute in mollit sit"],
          smiles: "nulla non",
          keggId: "Ut",
          structure: "",
        },
        amount: 9.369815488391442,
      },
      {
        molecule: {
          commonNames: ["reprehenderit nulla sint", "aute"],
          smiles: "consectetur in",
          keggId: "enim ut sunt in",
          structure: "",
        },
        amount: 17.727498396504284,
      },
    ],
  });

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
