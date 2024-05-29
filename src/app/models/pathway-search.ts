import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
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
      molecule: molecule.name,
      amount: 1,
    });
  }

  addTargetMoleculeFromMolecule(molecule: NovostoicMolecule) {
    this.form.controls["targetMolecule"].setValue({
      molecule: molecule.name,
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
          molecule: r.molecule.name,
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
          molecule: r.molecule.name,
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

  toRequestBody() {
    let stoic = this.form.controls["primaryPrecursor"].controls["amount"].value
      + " " + this.form.controls["targetMolecule"].controls["molecule"].value;
    this.form.controls["coReactants"].value.forEach((coReactant) => {
      stoic += " + " + coReactant.amount + " " + coReactant.molecule;
    });
    stoic += " <=> ";
    this.form.controls["coProducts"].value.forEach((coProduct) => {
      stoic += coProduct.amount + " " + coProduct.molecule + " + ";
    });
    stoic += this.form.controls["targetMolecule"].controls["amount"].value
      + " " + this.form.controls["targetMolecule"].controls["molecule"].value;

    const jobInfo = {
      substrate: this.form.controls["primaryPrecursor"].controls["molecule"].value,
      product: this.form.controls["targetMolecule"].controls["molecule"].value,
      max_steps: this.form.controls["maxSteps"].value,
      iterations: this.form.controls["maxPathways"].value,
      stoic,
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
      name: "N/A",
      keggId: "proident",
      structure: "https://fakeimg.pl/640x360",
    },
    targetMolecule: {
      smiles: "sint fugiat Ut",
      name: "N/A",
      keggId: "laborum dolor magna",
      structure: "https://fakeimg.pl/640x360",
    },
    stoichiometry: {
      reactants: [
        { molecule: { name: "Water", smiles: "OHO" }, amount: 1 },
        { molecule: { name: "CO2", smiles: "OCO" }, amount: 1 },
        { molecule: { name: "H2", smiles: "H" }, amount: 1 },
      ],
      products: [
        { molecule: { name: "Water", smiles: "OHO" }, amount: 1 },
        { molecule: { name: "H2", smiles: "H" }, amount: 4 },
      ],
    },
    pathways: [
      [
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
          ],
          deltaG: 10,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
          ],
          deltaG: -10,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: true,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
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
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
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
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
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
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
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
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
          ],
          deltaG: 10,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
          ],
          deltaG: 50,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
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
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
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
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
          ],
          deltaG: 50,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
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
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
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
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
          ],
          deltaG: 0,
          enzymes: [{ name: "E.3.5.1.31", amount: 0.1 }],
          reactionId: "ReactionID",
          isPrediction: false,
        },
        {
          primaryPrecursor: {
            smiles: "ex consequat sit adipisicing commodo",
            name: "N/A",
            keggId: "proident",
            structure: "https://fakeimg.pl/640x360",
          },
          targetMolecule: {
            smiles: "sint fugiat Ut",
            name: "N/A",
            keggId: "laborum dolor magna",
            structure: "https://fakeimg.pl/640x360",
          },
          reactants: [
            { name: "Water", smiles: "OHO" },
            { name: "CO2", smiles: "OCO" },
            { name: "H2", smiles: "H" },
          ],
          products: [
            { name: "Water", smiles: "OHO" },
            { name: "H2", smiles: "H" },
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
