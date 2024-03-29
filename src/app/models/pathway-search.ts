import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { JobCreate } from "../api/mmli-backend/v1";
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
      name: new FormControl("", [Validators.required]),
      amount: new FormControl<number | null>(null, [Validators.required]),
    });
  }

  addPrimaryPercursorFromMolecule(molecule: NovostoicMolecule) {
    this.form.controls["primaryPrecursor"].setValue({
      name: molecule.commonNames[0],
      amount: 1,
    });
  }

  addTargetMoleculeFromMolecule(molecule: NovostoicMolecule) {
    this.form.controls["targetMolecule"].setValue({
      name: molecule.commonNames[0],
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
          name: r.molecule.commonNames[0],
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
          name: r.molecule.commonNames[0],
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
        name: "mollit",
        amount: 1,
      },
      targetMolecule: {
        name: "minim fugiat pariatur deserunt Ut",
        amount: 1,
      },
      coReactants: [
        {
          name: "CO2",
          amount: 1,
        },
      ],
      coProducts: [
        {
          name: "H2",
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

  toJobCreate(): JobCreate {
    return {
      job_info: JSON.stringify({
        primaryPrecursor: this.form.controls["primaryPrecursor"].value,
        targetMolecule: this.form.controls["targetMolecule"].value,
        coReactants: this.form.controls["coReactants"].value,
        coProducts: this.form.controls["coProducts"].value,
        maxSteps: this.form.controls["maxSteps"].value,
        maxPathways: this.form.controls["maxPathways"].value,
        isThermodynamicalFeasible:
          this.form.controls["isThermodynamicalFeasible"].value,
        thermodynamicalFeasibleReactionsOnly:
          this.form.controls["thermodynamicalFeasibleReactionsOnly"].value,
        useEnzymeSelection: this.form.controls["useEnzymeSelection"].value,
        numEnzymeCandidates: this.form.controls["numEnzymeCandidates"].value,
      }),
      email: this.form.controls["subscriberEmail"].value || "",
      job_id: undefined,
      run_id: 0,
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
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: false,
        },
      ],
    ],
  };
}
