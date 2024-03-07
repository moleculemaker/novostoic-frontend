import { FormControl, FormGroup, Validators } from "@angular/forms";

export class OverallStoichiometryRequest {
  form = new FormGroup({
    primaryPrecursor: new FormControl("", [Validators.required]),
    targetMolecule: new FormControl("", [Validators.required]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
  });
}

export class OverallStoichiometryResponse {
  status: "LOADING" | "FINISHED" | "CANCELLED";
  jobId: string;
  submissionTime: Date;
  percentFinished: number;
  estimatedFinish: Date;
  primaryPrecursor: {
    smiles: string;
    commonName: string;
    keggId: string;
  };
  targetMolecule: {
    smiles: string;
    commonName: string;
    keggId: string;
  };
  result: {
    page: number;
    totalPages: number;
    numResultPerPage: number;
    totalResults: number;
    result: {
      stoichiometry: {
        reactants: { name: string; amount: string }[];
        yield: { name: string; amount: string }[];
      };
      yield: number;
      deltaG: number;
    }[];
  };
}
