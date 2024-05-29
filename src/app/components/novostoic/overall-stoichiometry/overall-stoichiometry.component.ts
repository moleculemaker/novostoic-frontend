import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, map } from "rxjs";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { NovostoicService } from "~/app/services/novostoic.service";
import { OverallStoichiometryRequest } from "~/app/models/overall-stoichiometry";
import { ChemicalAutoCompleteResponse, JobType } from "~/app/api/mmli-backend/v1";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-overall-stoichiometry",
  templateUrl: "./overall-stoichiometry.component.html",
  styleUrls: ["./overall-stoichiometry.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class OverallStoichiometryComponent {
  request = new OverallStoichiometryRequest(this.novostoicService);
  showDialog$ = new BehaviorSubject(false);
  validatedPrimaryPrecursor$ = new BehaviorSubject<ChemicalAutoCompleteResponse | null>(null);
  validatedTargetMolecule$ = new BehaviorSubject<ChemicalAutoCompleteResponse | null>(null);
  trustedPrimaryPrecursor$ = this.validatedPrimaryPrecursor$.pipe(map((chemical) => 
    chemical?.structure
    ? this.sanitizer.bypassSecurityTrustHtml(chemical?.structure || "")
    : null
  ));
  trustedTargetMolecule$ = this.validatedTargetMolecule$.pipe(map((chemical) => 
    chemical?.structure
    ? this.sanitizer.bypassSecurityTrustHtml(chemical?.structure || "")
    : null
  ));

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private novostoicService: NovostoicService,
  ) {}

  useExample() {
    this.request = OverallStoichiometryRequest.useExample(this.novostoicService);
  }

  useExampleValue(control: string, value: string) {
    this.request.form.get(control)!.setValue(value);
  }

  searchStructure() {
    this.showDialog$.next(false);
  }

  onSubmit() {
    if (!this.request.form.valid) {
      return;
    }

    this.novostoicService.createJobAndRun(
      JobType.NovostoicOptstoic,
      this.request.toRequestBody()
    ).subscribe((response) => {
      this.router.navigate([NovostoicTools.OVERALL_STOICHIOMETRY, "result", response.job_id]);
    });
  }
}
