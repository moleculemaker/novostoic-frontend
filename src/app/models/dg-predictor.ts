import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { JobCreate } from "../api/mmli-backend/v1";
import { NovostoicMolecule } from "./overall-stoichiometry";

interface ReactionFormControl {
  type: FormControl<string | null>;
  reactionSmiles?: FormControl<string | null>;
  moleculeNumber?: FormControl<string | null>;
  moleculeInchiOrSmiles?: FormControl<string | null>;
  reactionKeggId?: FormControl<string | null>;
}

export class ThermodynamicalFeasibilityRequest {
  form = new FormGroup({
    ph: new FormControl(5, [Validators.required]),
    ionicStrength: new FormControl(0.3, [Validators.required]),
    reactions: new FormArray([this.createReactionSmilesFormControl()]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
    reactionInputType: new FormControl("smiles", [Validators.required]),
  });

  private createReactionSmilesFormControl() {
    return new FormGroup<ReactionFormControl>({
      type: new FormControl("smiles"),
      reactionSmiles: new FormControl("", [Validators.required]),
    });
  }

  private createReactionKeggIDFormControl() {
    return new FormGroup<ReactionFormControl>({
      type: new FormControl("keggId"),
      moleculeNumber: new FormControl("", [Validators.required]),
      moleculeInchiOrSmiles: new FormControl("", [Validators.required]),
      reactionKeggId: new FormControl("", [Validators.required]),
    });
  }

  private clearAllInputHelper(form: FormGroup | FormArray) {
    Object.entries(form.controls).forEach(([key, control]) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.clearAllInputHelper(control);
      } else {
        if (key === "type") {
          return;
        }
        control.reset();
      }
    });
  }

  exampleRequest() {
    const request = new ThermodynamicalFeasibilityRequest();
    const smilesExample = this.createReactionSmilesFormControl();
    const keggIdExample = this.createReactionKeggIDFormControl();
    smilesExample.controls["reactionSmiles"]?.setValue(
      "CC(=O)C(=O)O.O=C=O>>CC(=O)C(=O)O~O=C(O)O",
    );
    keggIdExample.controls["moleculeNumber"]?.setValue("00001");
    keggIdExample.controls["moleculeInchiOrSmiles"]?.setValue("O=C(O)CCOCCCl");
    keggIdExample.controls["reactionKeggId"]?.setValue(
      "CCO.CCOC(=O)CCOCCCl.[Li+]~[OH-]>>N00001",
    );
    request.form.controls["reactions"].removeAt(0);
    request.form.controls["reactions"].push(smilesExample);
    request.form.controls["reactions"].push(keggIdExample);
    return request;
  }

  addReaction() {
    this.form.controls["reactions"].push(
      this.form.controls["reactionInputType"].value === "smiles"
        ? this.createReactionSmilesFormControl()
        : this.createReactionKeggIDFormControl(),
    );
  }

  removeReaction(idx: number) {
    this.form.controls["reactions"].removeAt(idx);
    if (!this.form.controls["reactions"].length) {
      this.addReaction();
    }
  }

  clearAllReactions() {
    this.clearAllInputHelper(this.form.controls["reactions"]);
  }

  toJobCreate(): JobCreate {
    return {
      job_info: JSON.stringify({
        ph: this.form.controls["ph"].value,
        ionicStrength: this.form.controls["ionicStrength"].value,
        reactions: this.form.controls["reactions"].value,
      }),
      email: this.form.controls["subscriberEmail"].value || "",
      job_id: undefined,
      run_id: 0,
    };
  }
}

export class ThermodynamicalFeasibilityResponse {
  results: Array<{
    reaction: string;
    gibbsEnergy: number;
  }>;

  public static example = [
    {
      reaction: "CCO.CCOC(=O)CCOCCCl.[Li+]~[OH-]>>O=C(O)CCOCCCl",
      gibbsEnergy: 500,
    },
    {
      reaction: "CC(=O)C(=O)O.O=C=O>>CC(=O)C(=O)O~O=C(O)O",
      gibbsEnergy: 300,
    },
  ];
}
