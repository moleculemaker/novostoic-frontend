import { FormGroup, FormControl, Validators } from "@angular/forms";
import { JobCreate } from "../api/mmli-backend/v1";
import {
  NovostoicMolecule,
  NovostoicStoichiometry,
} from "./overall-stoichiometry";

export class PathwaySearchRequest {
  form = new FormGroup({
    primaryPrecursor: new FormControl("", [Validators.required]),
    targetMolecule: new FormControl("", [Validators.required]),
    coReactants: new FormGroup({}),
    coProducts: new FormGroup({}),
    maxSteps: new FormControl(3, [Validators.required]),
    maxPathways: new FormControl(3, [Validators.required]),
    isThermodynamicalFeasible: new FormControl(false),
    useEnzymeSelection: new FormControl(false),
    numEnzymeCandidates: new FormControl(0),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
  });

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
