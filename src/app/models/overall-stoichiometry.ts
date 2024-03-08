import { FormControl, FormGroup, Validators } from "@angular/forms";
import { JobCreate } from "../api/mmli-backend/v1";

export class OverallStoichiometryRequest {
  form = new FormGroup({
    primaryPrecursor: new FormControl("", [Validators.required]),
    targetMolecule: new FormControl("", [Validators.required]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
  });

  toJobCreate(): JobCreate {
    return {
      job_info: JSON.stringify({
        primaryPrecursor: this.form.controls["primaryPrecursor"].value,
        targetMolecule: this.form.controls["targetMolecule"].value,
      }),
      email: this.form.controls["subscriberEmail"].value || "",
      job_id: undefined,
      run_id: 0,
    };
  }
}

interface NovostoicMolecule {
  commonNames: string[]; // one molecule might have multiple common names
  smiles: string;
  keggId?: string;
  structure?: string; // svg or data url to display molecule structure
}

export class OverallStoichiometryResponse {
  /** The following are included in jobs service
   * status: "LOADING" | "FINISHED" | "CANCELLED";
   * jobId: string;
   * submissionTime: Date;

   * Not existing yet
   * percentFinished: number;
   * estimatedFinish: Date;
   */

  primaryPrecursor: NovostoicMolecule;
  targetMolecule: NovostoicMolecule;

  // return all results at once, having pagination will increase burden
  results: Array<{
    stoichiometry: {
      reactants: Array<{ molecule: NovostoicMolecule; amount: number }>;
      products: Array<{ molecule: NovostoicMolecule; amount: number }>;
    };
    yield: number;
    deltaG: number;
  }>;
}
