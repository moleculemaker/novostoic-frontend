import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { DgPredictorRequestBody, JobCreate, ReactionsInner } from "../api/mmli-backend/v1";

interface ReactionFormControl {
  type: FormControl<ReactionsInner['type'] | null>;
  reactionSmiles?: FormControl<ReactionsInner['smiles'] | null>;
  moleculeNumber?: FormControl<ReactionsInner['molecule_number'] | null>;
  moleculeInchiOrSmiles?: FormControl<ReactionsInner['molecule_inchi_or_smiles'] | null>;
  reactionKeggId?: FormControl<ReactionsInner['reaction_keggid'] | null>;
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

    request.form.controls["reactions"].removeAt(0);
    request.form.controls["reactions"].push(this.createReactionKeggIDFormControl());

    request.form.setValue({
      ph: 7,
      ionicStrength: 0.1,
      reactions: [
        {
          type: "keggId",
          moleculeNumber: "00001",
          moleculeInchiOrSmiles: "InChI=1S/C14H12O/c15-14-8-4-7-13(11-14)10-9-12-5-2-1-3-6-12/h1-11,15H/b10-9+",
          reactionKeggId: "C01745 + C00004 <=> N00001 + C00003 + C00001",
        }
      ],
      agreeToSubscription: false,
      subscriberEmail: "",
      reactionInputType: "smiles",
    });
    
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

  toRequestBody(): DgPredictorRequestBody {
    return {
      jobId: "",
      ph: this.form.controls["ph"].value || 7,
      ionic_strength: this.form.controls["ionicStrength"].value || 0.3,
      reactions: this.form.controls["reactions"].value.map((reaction) => ({
        type: reaction.type as ReactionsInner["type"],
        smiles: reaction.reactionSmiles as ReactionsInner["smiles"],
        molecule_number: reaction.moleculeNumber as ReactionsInner["molecule_number"],
        molecule_inchi_or_smiles: reaction.moleculeInchiOrSmiles as ReactionsInner["molecule_inchi_or_smiles"],
        reaction_keggid: reaction.reactionKeggId as ReactionsInner["reaction_keggid"],
      })),
      user_email: this.form.controls["subscriberEmail"].value || "",
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
      reaction: "C01745 + C00004 <=> N00001 + C00003 + C00001",
      gibbsEnergy: -121.74,
    },
  ];
}
