import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject, map } from "rxjs";

import { ImageExporter } from "../marvinjs";

@Component({
  selector: "app-overall-stoichiometry",
  templateUrl: "./overall-stoichiometry.component.html",
  styleUrls: ["./overall-stoichiometry.component.scss"],
  host: {
    class: "grow",
  },
})
export class OverallStoichiometryComponent {
  stoichiometryForm = new FormGroup({
    primaryPrecursor: new FormControl("", [Validators.required]),
    targetMolecule: new FormControl("", [Validators.required]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
  });

  currentFormControl$ = new BehaviorSubject<
    "primaryPrecursor" | "targetMolecule"
  >("primaryPrecursor");
  showDialog$ = new BehaviorSubject(false);

  constructor(private router: Router) {}

  searchStructure() {
    this.showDialog$.next(false);
  }

  onSubmit(form: FormGroup) {
    this.router.navigate(["/loading"]);
  }
}
