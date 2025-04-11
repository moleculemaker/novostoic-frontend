import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import {
  NovostoicMolecule,
  NovostoicStoichiometry,
} from "./overall-stoichiometry";
import exampleResponse from './output.pathway.response.json'
import { presenceEnforcementOnAmountAndMolecule, requireBothAmountAndMolecule } from "../validators/novostoic-chemical-validator";
import { Loadable, NovostoicService } from "../services/novostoic.service";
import { ChemicalAutoCompleteResponse } from "../api/mmli-backend/v1/model/chemicalAutoCompleteResponse";

export class PathwaySearchRequest {
  primaryPrecursor: Loadable<ChemicalAutoCompleteResponse> = { status: 'na', data: null };
  targetMolecule: Loadable<ChemicalAutoCompleteResponse> = { status: 'na', data: null };
  coReactants: Array<Loadable<ChemicalAutoCompleteResponse>> = [];
  coProducts: Array<Loadable<ChemicalAutoCompleteResponse>> = [];
  pathwayParameterSettings = {
    maxSteps: {
      min: 0,
      max: 10,
      step: 1,
      disableSignInput: true,
      disableExponentialInput: true,
    },
    maxPathways: {
      min: 0,
      max: 10,
      step: 1,
      disableSignInput: true,
      disableExponentialInput: true,
    },
    numEnzymeCandidates: {
      min: 0,
      max: 10,
      step: 1,
      disableSignInput: true,
      disableExponentialInput: true,
    },
    primaryPrecursor: {
      amount: {
        min: 0.1,
        max: Infinity,
        step: 0.1,
        disableSignInput: true,
        disableExponentialInput: true,
      },
      required: true,
    },
    targetMolecule: {
      amount: {
        min: 0.1,
        max: Infinity,
        step: 0.1,
        disableSignInput: true,
        disableExponentialInput: true,
      },
      required: true,
    },
    coReactant: {
      amount: {
        min: 0.1,
        max: Infinity,
        step: 0.1,
        disableSignInput: true,
        disableExponentialInput: true,
      },
      required: false,
    },
    coProduct: {
      amount: {
        min: 0.1,
        max: Infinity,
        step: 0.1,
        disableSignInput: true,
        disableExponentialInput: true,
      },
      required: false,
    },
  };

  form = new FormGroup({
    primaryPrecursor: this.createMoleculeInputWithAmount(
      this.pathwayParameterSettings.primaryPrecursor.required
    ),
    targetMolecule: this.createMoleculeInputWithAmount(
      this.pathwayParameterSettings.targetMolecule.required
    ),
    coReactants: new FormArray([this.createMoleculeInputWithAmount(
      this.pathwayParameterSettings.coReactant.required
    )]),
    coProducts: new FormArray([this.createMoleculeInputWithAmount(
      this.pathwayParameterSettings.coProduct.required
    )]),
    maxSteps: new FormControl(3, [
      Validators.required, 
      Validators.min(this.pathwayParameterSettings.maxSteps.min), 
      Validators.max(this.pathwayParameterSettings.maxSteps.max)]
    ),
    maxPathways: new FormControl(3, [
      Validators.required, 
      Validators.min(this.pathwayParameterSettings.maxPathways.min), 
      Validators.max(this.pathwayParameterSettings.maxPathways.max)
    ]),
    thermodynamicReactionsFilterMode: new FormControl("none"),
    useEnzymeSelection: new FormControl(true),
    numEnzymeCandidates: new FormControl(0, [
      Validators.required, 
      Validators.min(this.pathwayParameterSettings.numEnzymeCandidates.min), 
      Validators.max(this.pathwayParameterSettings.numEnzymeCandidates.max)
    ]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
  });

  private createMoleculeInputWithAmount(required: boolean) {
    return new FormGroup<{
      amount: FormControl<number | null>,
      molecule: FormControl<string | null>,
    }>({
      amount: new FormControl(null),
      molecule: new FormControl(null),
    }, {
      validators: required ? [requireBothAmountAndMolecule] : [presenceEnforcementOnAmountAndMolecule],
    })
  }

  constructor(private novostoicService: NovostoicService) {}

  addPrimaryPercursorFromMolecule(molecule: NovostoicMolecule) {
    this.form.controls["primaryPrecursor"].setValue({
      molecule: molecule.metanetx_id || null,
      amount: 1,
    });
    this.primaryPrecursor = { status: 'loaded', data: molecule as ChemicalAutoCompleteResponse };
  }

  addTargetMoleculeFromMolecule(molecule: NovostoicMolecule) {
    this.form.controls["targetMolecule"].setValue({
      molecule: molecule.metanetx_id || null,
      amount: 1,
    });
    this.targetMolecule = { status: 'loaded', data: molecule as ChemicalAutoCompleteResponse };
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
    this.coReactants = stoichiometry.reactants.map((r) => ({ status: 'loaded', data: r.molecule as ChemicalAutoCompleteResponse }));

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
    this.coProducts = stoichiometry.products.map((r) => ({ status: 'loaded', data: r.molecule as ChemicalAutoCompleteResponse }));
  }

  addCoReactant() {
    this.form.controls["coReactants"].push(
      this.createMoleculeInputWithAmount(false),
    );
    this.coReactants.push({ status: 'na', data: null });
  }

  addCoProduct() {
    this.form.controls["coProducts"].push(this.createMoleculeInputWithAmount(false));
    this.coProducts.push({ status: 'na', data: null });
  }

  removeCoReactant(index: number) {
    this.form.controls["coReactants"].removeAt(index);
    this.coReactants.splice(index, 1);
  }

  removeCoProduct(index: number) {
    this.form.controls["coProducts"].removeAt(index);
    this.coProducts.splice(index, 1);
  }

  resetStoichiometry() {
    // Reset primary precursor and target molecule with initial values
    this.form.controls["primaryPrecursor"].reset({
      amount: null,
      molecule: null
    });
    this.form.controls["targetMolecule"].reset({
      amount: null,
      molecule: null
    });

    // Clear and reset co-reactants
    this.form.controls["coReactants"].clear();
    this.addCoReactant();
    this.coReactants = [{ status: 'na', data: null }];

    // Clear and reset co-products
    this.form.controls["coProducts"].clear();
    this.addCoProduct();
    this.coProducts = [{ status: 'na', data: null }];
  }

  resetSetting() {
    this.form.controls["maxSteps"].reset(3);
    this.form.controls["maxPathways"].reset(3);
    this.form.controls['thermodynamicReactionsFilterMode'].reset("none");
    this.form.controls["useEnzymeSelection"].reset(false);
    this.form.controls["numEnzymeCandidates"].reset(0);
  }

  static useExample(novostoicService: NovostoicService) {
    const request = new PathwaySearchRequest(novostoicService);
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
    request.primaryPrecursor = {
      status: 'loaded',
      data: {
        "name": "3-methyl-2-oxobutanoate",
        "smiles": "CC(C)C(=O)C(=O)O",
        "inchi": "InChI=1S/C5H8O3/c1-3(2)4(6)5(7)8/h3H,1-2H3,(H,7,8)/p-1",
      "inchi_key": "InChIKey=QHKABHOOEWYVLI-UHFFFAOYSA-M",
      "metanetx_id": "MNXM732866",
        "kegg_id": "C00141",
      }
    };
    request.targetMolecule = {
      status: 'loaded',
      data: {
        "name": "isobutanol",
        "smiles": "CC(C)CO",
      "inchi": "InChI=1S/C4H10O/c1-4(2)3-5/h4-5H,3H2,1-2H3",
      "inchi_key": "InChIKey=ZXEKIIBDNHEJCQ-UHFFFAOYSA-N",
      "metanetx_id": "MNXM5188",
      "kegg_id": "C14710",
    }
  };
    request.coReactants = [
      {
        status: 'loaded',
        data: {
          "name": "NADH",
        "smiles": "NC(=O)C1=CN([C@@H]2O[C@H](COP(=O)(O)OP(=O)(O)OC[C@H]3O[C@@H](n4cnc5c(N)ncnc54)[C@H](O)[C@@H]3O)[C@@H](O)[C@H]2O)C=CC1",
        "inchi": "InChI=1S/C21H29N7O14P2/c22-17-12-19(25-7-24-17)28(8-26-12)21-16(32)14(30)11(41-21)6-39-44(36,37)42-43(34,35)38-5-10-13(29)15(31)20(40-10)27-3-1-2-9(4-27)18(23)33/h1,3-4,7-8,10-11,13-16,20-21,29-32H,2,5-6H2,(H2,23,33)(H,34,35)(H,36,37)(H2,22,24,25)/p-2/t10-,11-,13-,14-,15-,16-,20-,21-/m1/s1",
        "inchi_key": "InChIKey=BOPGDPNILDQYTO-NNYOXOHSSA-L",
        "metanetx_id": "MNXM10",
        "kegg_id": "C00004",
      }
    }
    ];
    request.coProducts = [
      {
        status: 'loaded',
        data: {
          "name": "NAD(+)",
          "smiles": "NC(=O)c1ccc[n+]([C@@H]2O[C@H](COP(=O)([O-])OP(=O)(O)OC[C@H]3O[C@@H](n4cnc5c(N)ncnc54)[C@H](O)[C@@H]3O)[C@@H](O)[C@H]2O)c1",
        "inchi": "InChI=1S/C21H27N7O14P2/c22-17-12-19(25-7-24-17)28(8-26-12)21-16(32)14(30)11(41-21)6-39-44(36,37)42-43(34,35)38-5-10-13(29)15(31)20(40-10)27-3-1-2-9(4-27)18(23)33/h1-4,7-8,10-11,13-16,20-21,29-32H,5-6H2,(H5-,22,23,24,25,33,34,35,36,37)/p-1/t10-,11-,13-,14-,15-,16-,20-,21-/m1/s1",
          "inchi_key": "InChIKey=BAWFJGJZGIEFAR-NNYOXOHSSA-M",
          "metanetx_id": "MNXM8",
          "kegg_id": "C00003",
        }
      },
      {
        status: 'loaded',
        data: {
          "name": "CO2",
          "smiles": "O=C=O",
          "inchi": "InChI=1S/CO2/c2-1-3",
          "inchi_key": "InChIKey=CURLTUGMZLYLDI-UHFFFAOYSA-N",
          "metanetx_id": "MNXM13",
          "kegg_id": "C00011",
        }
      }
    ];
      
    return request;
  }

  isExampleUsed() {
    return this.form.controls["primaryPrecursor"].value.molecule === "MNXM732866" &&
      this.form.controls["primaryPrecursor"].value.amount === 1 &&
      this.form.controls["targetMolecule"].value.molecule === "MNXM5188" &&
      this.form.controls["targetMolecule"].value.amount === 1 &&
      this.form.controls["coReactants"].value[0].molecule === "MNXM10" &&
      this.form.controls["coReactants"].value[0].amount === 1 &&
      this.form.controls["coProducts"].value[0].molecule === "MNXM8" &&
      this.form.controls["coProducts"].value[0].amount === 1 &&
      this.form.controls["coProducts"].value[1].molecule === "MNXM13" &&
      this.form.controls["coProducts"].value[1].amount === 1 &&
      this.form.controls["maxSteps"].value === 3 &&
      this.form.controls["maxPathways"].value === 3 &&
      this.form.controls["useEnzymeSelection"].value === false &&
      this.form.controls["numEnzymeCandidates"].value === 0;
  }

  toRequestBody() {
    if (!this.primaryPrecursor.data || !this.targetMolecule.data) {
      throw new Error("Primary precursor or target molecule not set");
    }
    const jobInfo = {
      substrate: {
        amount: this.form.controls["primaryPrecursor"].value.amount,
        molecule: this.primaryPrecursor.data!.metanetx_id,
      },
      product: {
        amount: this.form.controls["targetMolecule"].value.amount,
        molecule: this.targetMolecule.data!.metanetx_id,
      },
      max_steps: this.form.controls["maxSteps"].value,
      iterations: this.form.controls["maxPathways"].value,
      reactants: this.coReactants
        .filter((c) => c.status === 'loaded')
        .map((c, i) => ({
          amount: this.form.controls["coReactants"].at(i)?.value.amount,
          molecule: c.data!.metanetx_id,
        })),
      products: this.coProducts
        .filter((c) => c.status === 'loaded')
        .map((c, i) => ({
          amount: this.form.controls["coProducts"].at(i)?.value.amount,
          molecule: c.data!.metanetx_id,
        })),
      num_enzymes: this.form.controls["numEnzymeCandidates"].value,
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
  reactionRule: string;
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
