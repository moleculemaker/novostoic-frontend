import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { PathwaySearchRequest } from "~/app/models/pathway-search";

@Component({
  selector: "app-pathway-search",
  templateUrl: "./pathway-search.component.html",
  styleUrls: ["./pathway-search.component.scss"],
  host: {
    class: "grow",
  },
})
export class PathwaySearchComponent {
  request = new PathwaySearchRequest();
  editing$ = new BehaviorSubject(true);
  showDialog$ = new BehaviorSubject(false);
  currentFormControl$ = new BehaviorSubject<
    "primaryPrecursor" | "targetMolecule"
  >("primaryPrecursor");

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

  constructor(private router: Router) {}

  onSubmit(form: PathwaySearchRequest) {
    this.router.navigate(["/pathway-search/result"]);
  }

  searchStructure() {}
}
