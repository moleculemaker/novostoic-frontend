import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { JobCreate, MoleculeWithAmount, NovostoicRequestBody } from "../api/mmli-backend/v1";
import {
  NovostoicMolecule,
  NovostoicStoichiometry,
} from "./overall-stoichiometry";

export class PathwaySearchRequest {
  form = new FormGroup({
    primaryPrecursor: this.createMoleculeInputWithAmount(),
    targetMolecule: this.createMoleculeInputWithAmount(),
    coReactants: new FormArray([this.createMoleculeInputWithAmount()]),
    coProducts: new FormArray([this.createMoleculeInputWithAmount()]),
    maxSteps: new FormControl(3, [Validators.required]),
    maxPathways: new FormControl(3, [Validators.required]),
    isThermodynamicalFeasible: new FormControl(false),
    thermodynamicalFeasibleReactionsOnly: new FormControl(false),
    useEnzymeSelection: new FormControl(false),
    numEnzymeCandidates: new FormControl({
      value: 0,
      disabled: true,
    }),
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
      molecule: molecule.commonNames[0],
      amount: 1,
    });
  }

  addTargetMoleculeFromMolecule(molecule: NovostoicMolecule) {
    this.form.controls["targetMolecule"].setValue({
      molecule: molecule.commonNames[0],
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
          molecule: r.molecule.commonNames[0],
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
          molecule: r.molecule.commonNames[0],
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
    this.form.controls["isThermodynamicalFeasible"].reset(false);
    this.form.controls["thermodynamicalFeasibleReactionsOnly"].reset(false);
    this.form.controls["useEnzymeSelection"].reset(false);
    this.form.controls["numEnzymeCandidates"].reset(0);
  }

  static useExample() {
    const request = new PathwaySearchRequest();
    // Create example request.
    request.form.setValue({
      primaryPrecursor: {
        molecule: "mollit",
        amount: 1,
      },
      targetMolecule: {
        molecule: "minim fugiat pariatur deserunt Ut",
        amount: 1,
      },
      coReactants: [
        {
          molecule: "CO2",
          amount: 1,
        },
      ],
      coProducts: [
        {
          molecule: "H2",
          amount: 1,
        },
      ],
      maxSteps: 3,
      maxPathways: 3,
      isThermodynamicalFeasible: false,
      thermodynamicalFeasibleReactionsOnly: false,
      useEnzymeSelection: false,
      numEnzymeCandidates: 0,
      agreeToSubscription: false, // Add agreeToSubscription property
      subscriberEmail: null, // Add subscriberEmail property
    });
    return request;
  }

  toRequestBody(): NovostoicRequestBody {
    return {
      jobId: '',
      primary_precursor: this.form.controls["primaryPrecursor"].value as MoleculeWithAmount,
      target_molecule: this.form.controls["targetMolecule"].value as MoleculeWithAmount,
      co_reactants: this.form.controls["coReactants"].value as Array<MoleculeWithAmount>,
      co_products: this.form.controls["coProducts"].value as Array<MoleculeWithAmount>,
      max_steps: this.form.controls["maxSteps"].value || 3,
      max_pathways: this.form.controls["maxPathways"].value || 10,
      is_thermodynamic_feasible:
        this.form.controls["isThermodynamicalFeasible"].value || false,
      thermodynamical_feasible_reaction_only:
        this.form.controls["thermodynamicalFeasibleReactionsOnly"].value || false,
      use_enzyme_selection: this.form.controls["useEnzymeSelection"].value || false,
      num_enzyme_candidates: this.form.controls["numEnzymeCandidates"].value || 0,
      user_email: this.form.controls["subscriberEmail"].value || "",
    };
  }
}

export interface NovostoicReaction {
  primaryPrecursor?: NovostoicMolecule;
  targetMolecule?: NovostoicMolecule;
  reactants: Array<NovostoicMolecule>;
  products: Array<NovostoicMolecule>;
  deltaG: number;
  enzymes: Array<{ name: string; amount: number }>;
  reactionId: string;
  isPrediction: boolean;
  confidenceScore?: number;
}

export class PathwaySearchResponse {
  primaryPrecursor: NovostoicMolecule;
  targetMolecule: NovostoicMolecule;
  stoichiometry: NovostoicStoichiometry;
  pathways: Array<Array<NovostoicReaction>>;

  static example: PathwaySearchResponse = {
    primaryPrecursor: {
      smiles: "ex consequat sit adipisicing commodo",
      commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
      keggId: "proident",
      structure: "https://fakeimg.pl/640x360",
    },
    targetMolecule: {
      smiles: "sint fugiat Ut",
      commonNames: [
        "minim fugiat pariatur deserunt Ut",
        "exercitation Ut",
        "Duis est nostrud",
      ],
      keggId: "laborum dolor magna",
      structure: "https://fakeimg.pl/640x360",
    },
    stoichiometry: {
      reactants: [
        { molecule: { commonNames: ["Water"], smiles: "OHO" }, amount: 1 },
        { molecule: { commonNames: ["CO2"], smiles: "OCO" }, amount: 1 },
        { molecule: { commonNames: ["H2"], smiles: "H" }, amount: 1 },
      ],
      products: [
        { molecule: { commonNames: ["Water"], smiles: "OHO" }, amount: 1 },
        { molecule: { commonNames: ["H2"], smiles: "H" }, amount: 4 },
      ],
    },
    pathways: [
      [
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: 10,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: -10,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: true,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: -30,
          enzymes: [
            { name: "E.3.5.1.31", amount: 0.8 },
            { name: "E.3.5.1.31", amount: 0.6 },
            { name: "E.3.5.1.31", amount: 0.3 },
            { name: "E.3.5.1.31", amount: 0.1 },
          ],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: -20,
          enzymes: [
            { name: "E.3.5.1.31", amount: 0.8 },
            { name: "E.3.5.1.31", amount: 0.6 },
            { name: "E.3.5.1.31", amount: 0.3 },
            { name: "E.3.5.1.31", amount: 0.1 },
          ],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: 10,
          enzymes: [
            { name: "E.3.5.1.31", amount: 0.8 },
            { name: "E.3.5.1.31", amount: 0.6 },
            { name: "E.3.5.1.31", amount: 0.3 },
            { name: "E.3.5.1.31", amount: 0.1 },
          ],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: 15,
          enzymes: [
            { name: "E.3.5.1.31", amount: 0.8 },
            { name: "E.3.5.1.31", amount: 0.6 },
            { name: "E.3.5.1.31", amount: 0.3 },
            { name: "E.3.5.1.31", amount: 0.1 },
          ],
          reactionId: "ReactionID",
          isPrediction: true,
        },
      ],
      [
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: 10,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: 50,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: 18,
          enzymes: [
            { name: "E.3.5.1.31", amount: 0.8 },
            { name: "E.3.5.1.31", amount: 0.6 },
            { name: "E.3.5.1.31", amount: 0.3 },
            { name: "E.3.5.1.31", amount: 0.1 },
          ],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: -10,
          enzymes: [
            { name: "E.3.5.1.31", amount: 0.8 },
            { name: "E.3.5.1.31", amount: 0.6 },
            { name: "E.3.5.1.31", amount: 0.3 },
            { name: "E.3.5.1.31", amount: 0.1 },
          ],
          reactionId: "ReactionID",
          isPrediction: true,
        },
      ],
      [
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: 50,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: 50,
          enzymes: [
            { name: "E.3.5.1.31", amount: 0.8 },
            { name: "E.3.5.1.31", amount: 0.6 },
            { name: "E.3.5.1.31", amount: 0.3 },
            { name: "E.3.5.1.31", amount: 0.1 },
          ],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: 50,
          enzymes: [
            { name: "E.3.5.1.31", amount: 0.8 },
            { name: "E.3.5.1.31", amount: 0.6 },
            { name: "E.3.5.1.31", amount: 0.3 },
            { name: "E.3.5.1.31", amount: 0.1 },
          ],
          reactionId: "ReactionID",
          isPrediction: false,
        },
      ],
      [
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: 0,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            commonNames: [
              "minim fugiat pariatur deserunt Ut",
              "exercitation Ut",
              "Duis est nostrud",
            ],
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["CO2"], smiles: "OCO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          products: [
            { commonNames: ["Water"], smiles: "OHO" },
            { commonNames: ["H2"], smiles: "H" },
          ],
          deltaG: 0,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: false,
        },
      ],
    ],
  };
}
