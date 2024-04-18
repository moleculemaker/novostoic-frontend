import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { OverallStoichiometryRequest } from "~/app/models/overall-stoichiometry";

@Component({
  selector: "app-overall-stoichiometry",
  templateUrl: "./overall-stoichiometry.component.html",
  styleUrls: ["./overall-stoichiometry.component.scss"],
})
export class OverallStoichiometryComponent {
  request = new OverallStoichiometryRequest();

  currentFormControl$ = new BehaviorSubject<
    "primaryPrecursor" | "targetMolecule"
  >("primaryPrecursor");
  showDialog$ = new BehaviorSubject(false);

  constructor(private router: Router) {}

  searchStructure() {
    this.showDialog$.next(false);
  }

  onSubmit(form: OverallStoichiometryRequest) {
    this.router.navigate([NovostoicTools.OVERALL_STOICHIOMETRY, "result"]);
  }
}
