import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import {
  NovostoicMolecule,
  NovostoicStoichiometry,
} from "./overall-stoichiometry";
import exampleResponse from './output.pathway.response.json'

export class PathwaySearchRequest {
  form = new FormGroup({
    primaryPrecursor: this.createMoleculeInputWithAmount(),
    targetMolecule: this.createMoleculeInputWithAmount(),
    coReactants: new FormArray([this.createMoleculeInputWithAmount()]),
    coProducts: new FormArray([this.createMoleculeInputWithAmount()]),
    maxSteps: new FormControl(3, [Validators.required]),
    maxPathways: new FormControl(3, [Validators.required]),
    thermodynamicReactionsFilterMode: new FormControl("none"),
    useEnzymeSelection: new FormControl(true),
    numEnzymeCandidates: new FormControl(0, [Validators.required]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
  });

  private createMoleculeInputWithAmount() {
    return new FormGroup({
      molecule: new FormControl<string>("", [Validators.required]),
      amount: new FormControl<number>(0, [Validators.required]),
    });
  }

  addPrimaryPercursorFromMolecule(molecule: NovostoicMolecule) {
    this.form.controls["primaryPrecursor"].setValue({
      molecule: molecule.metanetx_id || null,
      amount: 1,
    });
  }

  addTargetMoleculeFromMolecule(molecule: NovostoicMolecule) {
    this.form.controls["targetMolecule"].setValue({
      molecule: molecule.metanetx_id || null,
      amount: 1,
    });
  }

  addFromStoichiometry(stoichiometry: NovostoicStoichiometry) {
    this.form.controls["coReactants"].clear();
    for (let i = 0; i < stoichiometry.reactants.length; i++) {
      this.addCoReactant();
    }
    this.form.controls["coReactants"].setValue(
      stoichiometry.reactants
        .map((r) => ({
          molecule: r.molecule.metanetx_id || null,
          amount: r.amount,
        })),
    );

    this.form.controls["coProducts"].clear();
    for (let i = 0; i < stoichiometry.products.length; i++) {
      this.addCoProduct();
    }
    this.form.controls["coProducts"].setValue(
      stoichiometry.products
        .map((r) => ({
          molecule: r.molecule.metanetx_id || null,
          amount: r.amount,
        })),
    );
  }

  addCoReactant() {
    this.form.controls["coReactants"].push(
      this.createMoleculeInputWithAmount(),
    );
  }

  addCoProduct() {
    this.form.controls["coProducts"].push(this.createMoleculeInputWithAmount());
  }

  removeCoReactant(index: number) {
    this.form.controls["coReactants"].removeAt(index);
  }

  removeCoProduct(index: number) {
    this.form.controls["coProducts"].removeAt(index);
  }

  resetStoichiometry() {
    this.form.controls["primaryPrecursor"].reset();
    this.form.controls["targetMolecule"].reset();
    this.form.controls["coReactants"].controls = [];
    this.form.controls["coProducts"].controls = [];
    this.addCoReactant();
    this.addCoProduct();
  }

  resetSetting() {
    this.form.controls["maxSteps"].reset(3);
    this.form.controls["maxPathways"].reset(3);
    this.form.controls['thermodynamicReactionsFilterMode'].reset("none");
    this.form.controls["useEnzymeSelection"].reset(false);
    this.form.controls["numEnzymeCandidates"].reset(0);
  }

  static useExample() {
    const request = new PathwaySearchRequest();
    request.addCoProduct();
    // Create example request.
    request.form.setValue({
      primaryPrecursor: {
        molecule: "MNXM732866",
        amount: 1,
      },
      targetMolecule: {
        molecule: "MNXM5188",
        amount: 1,
      },
      coReactants: [
        {
          molecule: "MNXM10",
          amount: 1,
        },
      ],
      coProducts: [
        {
          molecule: "MNXM8",
          amount: 1,
        },
        {
          molecule: "MNXM13",
          amount: 1,
        },
      ],
      maxSteps: 3,
      maxPathways: 3,
      thermodynamicReactionsFilterMode: "none",
      useEnzymeSelection: false,
      numEnzymeCandidates: 0,
      agreeToSubscription: false, // Add agreeToSubscription property
      subscriberEmail: null, // Add subscriberEmail property
    });
    return request;
  }

  toRequestBody() {
    const jobInfo = {
      substrate: this.form.controls["primaryPrecursor"].value,
      product: this.form.controls["targetMolecule"].value,
      max_steps: this.form.controls["maxSteps"].value,
      iterations: this.form.controls["maxPathways"].value,
      reactants: this.form.controls["coReactants"].value,
      products: this.form.controls["coProducts"].value,
    };
    return {
      job_info: JSON.stringify(jobInfo),
      // is_thermodynamic_feasible:
      //   this.form.controls["isThermodynamicalFeasible"].value || false,
      // thermodynamical_feasible_reaction_only:
      //   this.form.controls["thermodynamicalFeasibleReactionsOnly"].value || false,
      // use_enzyme_selection: this.form.controls["useEnzymeSelection"].value || false,
      // num_enzyme_candidates: this.form.controls["numEnzymeCandidates"].value || 0,
      email: this.form.controls["subscriberEmail"].value || "",
    };
  }
}

export interface NovostoicReaction {
  primaryPrecursor?: NovostoicMolecule;
  targetMolecule?: NovostoicMolecule;
  reactants: Array<{ molecule: NovostoicMolecule, amount: number }>;
  products: Array<{ molecule: NovostoicMolecule, amount: number }>;
  deltaG: {
    std: number,
    gibbsEnergy: number,
    reaction: string
  };
  enzymes: Array<any>;
  reactionId: string;
  isPrediction: boolean;
  confidenceScore?: number;
}

export class PathwaySearchResponse {
  primaryPrecursor: NovostoicMolecule;
  targetMolecule: NovostoicMolecule;
  stoichiometry: NovostoicStoichiometry;
  pathways: Array<Array<NovostoicReaction>>;

  static example: PathwaySearchResponse = exampleResponse;
}
