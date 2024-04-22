import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { JobCreate, JobsService, OptstoicRequestBody } from "~/app/api/mmli-backend/v1";
import { NovostoicService } from "~/app/services/novostoic.service";

@Component({
  selector: "app-overall-stoichiometry",
  templateUrl: "./overall-stoichiometry.component.html",
  styleUrls: ["./overall-stoichiometry.component.scss"],
  host: {
    class: 'grow'
  }
})
export class OverallStoichiometryComponent {
  form = new FormGroup({
    primaryPrecursor: new FormControl("", [Validators.required]),
    targetMolecule: new FormControl("", [Validators.required]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
  });

  currentFormControl$ = new BehaviorSubject<
    "primaryPrecursor" | "targetMolecule"
  >("primaryPrecursor");
  showDialog$ = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private novostoicService: NovostoicService,
    private jobService: JobsService
  ) {}

  useExample() {
    this.form.setValue({
      primaryPrecursor: "C00022",
      targetMolecule: "C21389",
      agreeToSubscription: false,
      subscriberEmail: "",
    });
  }

  searchStructure() {
    this.showDialog$.next(false);
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const data: OptstoicRequestBody = {
      jobId: "",
      user_email: this.form.controls['subscriberEmail'].value!,
      primary_precursor: this.form.controls['primaryPrecursor'].value!,
      target_molecule: this.form.controls['targetMolecule'].value!,
    }

    this.novostoicService.createJobAndRunOptstoic(data).subscribe((response) => {
      this.router.navigate([NovostoicTools.OVERALL_STOICHIOMETRY, "result", response.jobId]);
    });
  }
}
