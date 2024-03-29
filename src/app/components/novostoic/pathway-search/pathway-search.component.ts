import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { BehaviorSubject, combineLatest, map } from "rxjs";
import { PathwaySearchRequest } from "~/app/models/pathway-search";

@Component({
  selector: "app-pathway-search",
  templateUrl: "./pathway-search.component.html",
  styleUrls: ["./pathway-search.component.scss"],
  host: {
    class: "grow",
  },
})
export class PathwaySearchComponent implements OnInit {
  request = new PathwaySearchRequest();
  editing$ = new BehaviorSubject(false);
  showDialog$ = new BehaviorSubject(false);
  warningVisible$ = new BehaviorSubject(false);
  currentFormControl$ = new BehaviorSubject<
    "primaryPrecursor" | "targetMolecule"
  >("primaryPrecursor");

  // to maintain consistency when user goes from overall stoichiometry page
  // those values are used to populate the initial form
  primaryPrecursor$ = new BehaviorSubject({
    smiles: "N/A",
    commonNames: ["N/A"],
    keggId: "N/A",
    structure: "",
  });
  targetMolecule$ = new BehaviorSubject({
    smiles: "N/A",
    commonNames: ["N/A"],
    keggId: "N/A",
    structure: "",
  });
  stoichiometry$ = new BehaviorSubject({
    reactants: [
      {
        molecule: {
          smiles: "N/A",
          commonNames: ["N/A"],
          keggId: "N/A",
          structure: "",
        },
        amount: -1,
      },
    ],
    products: [
      {
        molecule: {
          smiles: "N/A",
          commonNames: ["N/A"],
          keggId: "N/A",
          structure: "",
        },
        amount: -1,
      },
      {
        molecule: {
          smiles: "N/A",
          commonNames: ["N/A"],
          keggId: "N/A",
          structure: "",
        },
        amount: -1,
      },
    ],
  });

  showWarning$ = combineLatest([
    this.warningVisible$,
    this.editing$
  ]).pipe(map(([visible, editing]) => visible && !editing));

  constructor(
    private router: Router,
    private location: Location) {}

  ngOnInit(): void {
    const state: any = this.location.getState();
    // check if the user comes from overall stoichiiometry page
    if (Object.hasOwn(state, "primaryPrecursor")) {
      this.primaryPrecursor$.next(state.primaryPrecursor);
      this.targetMolecule$.next(state.targetMolecule);
      this.stoichiometry$.next(state.stoichiometry);

      this.request.addPrimaryPercursorFromMolecule(state.primaryPrecursor);
      this.request.addTargetMoleculeFromMolecule(state.targetMolecule);
      this.request.addFromStoichiometry(state.stoichiometry);
    } else {
      this.editing$.next(true);
    }
  }

  onSubmit(form: PathwaySearchRequest) {
    this.router.navigate(["/pathway-search/result"]);
  }

  useExample() {
    this.editing$.next(true);
    this.request = PathwaySearchRequest.useExample();
  }

  searchStructure() {}
}
