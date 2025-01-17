import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { debounceTime } from "rxjs";

interface ReactionFormControl {
  type: FormControl<string | null>;
  containNovelMolecule?: FormControl<boolean | null>;
  reactionSmiles?: FormControl<string | null>;
  novelMolecules?: FormArray<FormGroup>;
  reactionKeggId?: FormControl<string | null>;
}

export class ThermodynamicalFeasibilityRequest {
  form = new FormGroup({
    ph: new FormControl(5, [Validators.required]),
    ionicStrength: new FormControl(0.3, [Validators.required]),
    reactions: new FormArray([
      this.createReactionKeggIDFormControl()
    ]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
    reactionInputType: new FormControl("keggId", [Validators.required]),
  });

  private uniqueNovelMolecule = new Set();
  private createReactionSmilesFormControl() {
    return new FormGroup<ReactionFormControl>({
      type: new FormControl("smiles"),
      reactionSmiles: new FormControl("", [Validators.required]),
    });
  }

  private createReactionKeggIDFormControl() {
    const formGroup = new FormGroup<ReactionFormControl>({
      type: new FormControl("keggId"),
      containNovelMolecule: new FormControl(false),
      novelMolecules: new FormArray([] as any[]),
      reactionKeggId: new FormControl("", [Validators.required]),
    });

    formGroup.controls["containNovelMolecule"]?.valueChanges.subscribe((value) => {
      if (value) {
        this.addNovelMolecule(formGroup);
      } else {
        formGroup.controls["novelMolecules"]?.controls.forEach((_, i) => {
          this.removeNovelMolecule(formGroup, i);
        });
      }
      formGroup.controls["novelMolecules"]?.controls.forEach((control) => {
        control.updateValueAndValidity();
      });
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
          containNovelMolecule: true,
          novelMolecules: [
            {
              iid: "iid-0.123456789",
              alias: "N00001",
              value: "InChI=1S/C14H12O/c15-14-8-4-7-13(11-14)10-9-12-5-2-1-3-6-12/h1-11,15H/b10-9+",
              moleculeExisted: false
            }
          ],
          reactionKeggId: "C01745 + C00004 <=> N00001 + C00003 + C00001",
        }
      ],
      agreeToSubscription: false,
      subscriberEmail: "",
      reactionInputType: "keggId",
    });
    
    return request;
  }

  isExampleUsed() {
    return this.form.controls["reactions"].value.length === 1
      && this.form.controls["reactions"].value[0].reactionKeggId === "C01745 + C00004 <=> N00001 + C00003 + C00001"
      && this.form.controls["reactions"].value[0].novelMolecules?.length === 1
      && this.form.controls["reactions"].value[0].novelMolecules?.[0].value === "InChI=1S/C14H12O/c15-14-8-4-7-13(11-14)10-9-12-5-2-1-3-6-12/h1-11,15H/b10-9+"
      && this.form.controls["ph"].value === 7
      && this.form.controls["ionicStrength"].value === 0.1;
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

  addNovelMolecule(subform: FormGroup<ReactionFormControl>) {
    const group = new FormGroup({
      iid: new FormControl(`iid-${Math.random()}`),
      alias: new FormControl("", [Validators.required]),
      value: new FormControl("", [Validators.required]),
      moleculeExisted: new FormControl(false),
    })

    // listen to value changes and update the molecule index
    group.controls['value'].valueChanges
      .subscribe((value) => {
        let aliasSet = false;
        
        this.uniqueNovelMolecule.clear();
        group.controls['moleculeExisted'].setValue(false);

        this.form.controls["reactions"].controls.forEach((reaction) => {
          reaction.controls['novelMolecules']?.controls.forEach((g) => {
            if (g.controls['iid'] === group.controls['iid']) {
              return;
            }

            const moleculeValue = g.controls['value'].value;
            this.uniqueNovelMolecule.add(moleculeValue);
            if (moleculeValue === value) {
              group.controls['alias'].setValue(g.controls['alias'].value);
              group.controls['moleculeExisted'].setValue(true);
              aliasSet = true;
            }
          });
        });

        if (!aliasSet) {
          const moleculeIndex = `${this.uniqueNovelMolecule.size + 1}`.padStart(5, "0");
          group.controls['alias'].setValue(`N${moleculeIndex}`);
        }
      });

      const moleculeIndex = `${this.uniqueNovelMolecule.size + 1}`.padStart(5, "0");
      group.controls['alias'].setValue(`N${moleculeIndex}`);

    subform.controls['novelMolecules']!.push(group);
  }

  removeNovelMolecule(subform: FormGroup<ReactionFormControl>, idx: number) {
    subform.controls["novelMolecules"]?.controls.forEach((group) => {
      group.controls['value'].clearValidators();
      group.controls['alias'].clearValidators();
    });

    subform.controls['novelMolecules']!.removeAt(idx);
    if (!subform.controls['novelMolecules']!.length) {
      this.addNovelMolecule(subform);
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
          add_info: {},
        }

        if (reaction.containNovelMolecule) {
          payload['add_info'] = {};
          reaction.novelMolecules?.forEach((group, i) => {
            payload["add_info"][group.alias] = group.value;
          });
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
