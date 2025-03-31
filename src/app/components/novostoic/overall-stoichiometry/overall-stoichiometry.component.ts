import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, map } from "rxjs";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { Loadable, NovostoicService } from "~/app/services/novostoic.service";
import { OverallStoichiometryRequest } from "~/app/models/overall-stoichiometry";
import { ChemicalAutoCompleteResponse, JobType } from "~/app/api/mmli-backend/v1";
import { MarvinjsInputComponent } from "../marvinjs-input/marvinjs-input.component";

@Component({
  selector: "app-overall-stoichiometry",
  templateUrl: "./overall-stoichiometry.component.html",
  styleUrls: ["./overall-stoichiometry.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class OverallStoichiometryComponent {
  @ViewChild('ppInput') ppInput!: MarvinjsInputComponent;
  @ViewChild('tmInput') tmInput!: MarvinjsInputComponent;

  request = new OverallStoichiometryRequest(this.novostoicService);
  showDialog$ = new BehaviorSubject(false);

  exampleJobId = "5a3cbcdca72d4fdaab33603725bb9ef8";
  examplePrimaryPrecursor = "C00022";
  exampleTargetMolecule = "C01013";
  examplePrimaryPrecursorUsed = false;
  exampleTargetMoleculeUsed = false;

  constructor(
    private router: Router,
    private novostoicService: NovostoicService,
  ) {}

  useExampleValue(control: string, value: string) {
    this.request.form.get(control)!.setValue(value);
  }

  searchStructure() {
    this.showDialog$.next(false);
  }

  onValidationStatusChange(role: 'primaryPrecursor' | 'targetMolecule', event: Loadable<ChemicalAutoCompleteResponse>) {
    const { status, data } = event;
    this.request[role] = event;
    if (status === 'loaded') {
      if (role === 'primaryPrecursor') {
        this.ppInput.setMarvinInputBypass(data?.smiles as string ?? '');
        this.examplePrimaryPrecursorUsed = data?.kegg_id === this.examplePrimaryPrecursor;
      } else {
        this.tmInput.setMarvinInputBypass(data?.smiles as string ?? '');
        this.exampleTargetMoleculeUsed = data?.kegg_id === this.exampleTargetMolecule;
      }
    }
  }

  onSubmit() {
    if (!this.request.form.valid) {
      return;
    }

    if (this.examplePrimaryPrecursorUsed && this.exampleTargetMoleculeUsed) {
      this.router.navigate([NovostoicTools.OVERALL_STOICHIOMETRY, "result", this.exampleJobId]);
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
