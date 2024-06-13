import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

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
    reactions: new FormArray([this.createReactionKeggIDFormControl()]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
    reactionInputType: new FormControl("keggId", [Validators.required]),
  });

  private createReactionSmilesFormControl() {
    return new FormGroup<ReactionFormControl>({
      type: new FormControl("smiles"),
      reactionSmiles: new FormControl("", [Validators.required]),
    });
  }

  private createReactionKeggIDFormControl() {
    const formGroup = new FormGroup<ReactionFormControl>({
      type: new FormControl("keggId"),
      moleculeNumber: new FormControl("", []),
      moleculeInchiOrSmiles: new FormControl("", []),
      reactionKeggId: new FormControl("", [Validators.required]),
    });

    formGroup.controls["moleculeInchiOrSmiles"]?.valueChanges.subscribe((value) => {
      if (value) {
        formGroup.controls["moleculeNumber"]?.addValidators([Validators.required]);
      } else {
        formGroup.controls["moleculeNumber"]?.clearValidators();
      }
      formGroup.controls["moleculeNumber"]?.updateValueAndValidity();
    });

    return formGroup;
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

  toRequestBody() {
    const jobInfo = {
      ph: this.form.controls["ph"].value || 7,
      ionic_strength: this.form.controls["ionicStrength"].value || 0.3,
      reactions: this.form.controls["reactions"].value.map((reaction) => {
        let payload: any = {
          type: reaction.type,
          smiles: reaction.reactionSmiles,
          reaction_keggid: reaction.reactionKeggId,
        }

        if (reaction.moleculeInchiOrSmiles) {
          payload["add_info"] = {
            ['N' + reaction.moleculeNumber]: reaction.moleculeInchiOrSmiles,
          };
        }

        return payload;
      }),
    };
    return {
      job_info: JSON.stringify(jobInfo),
      email: this.form.controls["subscriberEmail"].value || "",
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
