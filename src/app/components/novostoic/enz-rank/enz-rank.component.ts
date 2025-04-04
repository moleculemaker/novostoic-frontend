import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ChemicalAutoCompleteResponse, JobType } from "~/app/api/mmli-backend/v1";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { EnzymeSelectionRequest } from "~/app/models/enz-rank";
import { Loadable, NovostoicService } from "~/app/services/novostoic.service";
import { MarvinjsInputComponent } from "../marvinjs-input/marvinjs-input.component";

@Component({
  selector: "app-enz-rank",
  templateUrl: "./enz-rank.component.html",
  styleUrls: ["./enz-rank.component.scss"],
  host: {
    class: 'grow px-4 xl:w-content-xl xl:mr-64 xl:pr-6'
  }
})
export class EnzRankComponent {
  request = new EnzymeSelectionRequest();
  exampleJobId = "23f7f85f3b0545839785efc6368b4fe5";

  @ViewChild('ppInput') ppInput!: MarvinjsInputComponent;

  constructor(
    private router: Router, 
    private novostoicService: NovostoicService
  ) {}

  useExample() {
    this.request = EnzymeSelectionRequest.example();
  }

  uploadFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt, .fasta, .fa';
    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          this.request.form.controls['enzymeSequence'].setValue(text);
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  }

  getErrorString(errors: any) {
    return errors.map((error: any) => {
      const key = Object.keys(error)[0];
      const value = Object.values(error)[0];
      switch (key) {
        case 'noSequence':
          return `No sequence found.`;
        case 'containsColon':
          return `Sequence name "${value}" cannot contain colon.`;
        case 'exceedsMaxSeqNum':
          return `Exceeds maximum number of sequences (${this.request.MAX_SEQ_NUM}).`;
        case 'headerCannotBeEmpty':
          return `Header cannot be empty at sequence idx ${value}.`;
        case 'invalidSequence':
          return `Invalid sequence for sequence name "${value}".`;
        case 'sequenceLengthGreaterThan1022':
          return `Sequence length greater than 1022 for sequence name "${value}".`;
        case 'sequenceLengthIs0':
          return `Sequence length is 0 for sequence name "${value}".`;
        default:
          return null;
      }
    }).filter((error: string | null) => error !== null).join('<br/>');
  }

  onValidationStatusChange(event: Loadable<ChemicalAutoCompleteResponse>) {
    const { status, data } = event;
    this.request.primaryPrecursor = event;
    if (status === 'loaded') {
      this.ppInput.setMarvinInputBypass(data?.smiles as string);
    }
  }

  onSubmit() {
    if (!this.request.form.valid) {
      return;
    }

    if (this.request.isExampleUsed()) {
      this.router.navigate([NovostoicTools.ENZYME_ACTIVITY, "result", this.exampleJobId]);
      return;
    }

    this.novostoicService.createJobAndRun(
      JobType.NovostoicEnzrank,
      this.request.toRequestBody()
    ).subscribe((response) => {
      this.router.navigate([NovostoicTools.ENZYME_ACTIVITY, "result", response.job_id]);
    });
  }
}
