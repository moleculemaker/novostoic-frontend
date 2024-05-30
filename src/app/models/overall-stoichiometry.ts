import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NovostoicService } from "../services/novostoic.service";
import { ChemicalAutoCompleteResponse } from "../api/mmli-backend/v1";

export class OverallStoichiometryRequest {
  form = new FormGroup({
    primaryPrecursor: new FormControl("", [Validators.required]),
    targetMolecule: new FormControl("", [Validators.required]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
  });

  constructor(private novostoicService: NovostoicService) {}

  static useExample(service: NovostoicService): OverallStoichiometryRequest {
    const request = new OverallStoichiometryRequest(service);
    request.form.setValue({
      primaryPrecursor: "C00022",
      targetMolecule: "C21389",
      agreeToSubscription: false,
      subscriberEmail: "",
    });
    return request;
  }

  static createMoleculeFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl(""),
      smiles: new FormControl(""),
      kegg_id: new FormControl(""),
      structure: new FormControl(""),
      metanetx_id: new FormControl(""),
      inchi: new FormControl(""),
      inchi_key: new FormControl(""),
    });
  }

  toRequestBody() {
    const jobInfo = {
      primary_precursor: this.form.controls["primaryPrecursor"].value!,
      target_molecule: this.form.controls["targetMolecule"].value!,
    };
    return {
      email: this.form.controls['subscriberEmail'].value!,
      job_info: JSON.stringify(jobInfo),
    }
  }
}

export type NovostoicMolecule = Partial<ChemicalAutoCompleteResponse>;

export interface NovostoicStoichiometry {
  reactants: Array<{ molecule: NovostoicMolecule; amount: number }>;
  products: Array<{ molecule: NovostoicMolecule; amount: number }>;
}

export class OverallStoichiometryResponse {
  /** The following are included in jobs service
   * status: "LOADING" | "FINISHED" | "CANCELLED";
   * jobId: string;
   * submissionTime: Date;

   * Not existing yet
   * percentFinished: number;
   * estimatedFinish: Date;
   */

  primaryPrecursor: NovostoicMolecule;
  targetMolecule: NovostoicMolecule;

  // return all results at once, having pagination will increase burden
  results: Array<{
    stoichiometry: NovostoicStoichiometry;
    yield: number;
    deltaG: number;
  }>;

  static get example(): OverallStoichiometryResponse {
    const image =
      "data:image/jpeg;base64,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";
    return {
      primaryPrecursor: {
        smiles: "ex consequat sit adipisicing commodo",
        name: "N/A",
        kegg_id: "proident",
        structure: image,
      },
      targetMolecule: {
        smiles: "sint fugiat Ut",
        name: "N/A",
        kegg_id: "laborum dolor magna",
        structure: image,
      },
      results: [
        {
          stoichiometry: {
            reactants: [
              {
                molecule: {
                  name: "N/A",
                  smiles: "proident aute sint",
                  kegg_id: "nostrud aute ipsum proident sit",
                  structure: image,
                },
                amount: 10.312100871722501,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "eiusmod",
                  kegg_id: "proident in fugiat",
                  structure: image,
                },
                amount: 4.731076524801776,
              },
            ],
            products: [
              {
                molecule: {
                  name: "N/A",
                  smiles: "nulla non",
                  kegg_id: "Ut",
                  structure: image,
                },
                amount: 9.369815488391442,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "consectetur in",
                  kegg_id: "enim ut sunt in",
                  structure: image,
                },
                amount: 17.727498396504284,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "quis id enim reprehenderit",
                  kegg_id: "laboris veniam laborum labore",
                  structure: image,
                },
                amount: 2.1305437421409685,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "exercitation esse",
                  kegg_id: "qui",
                  structure: image,
                },
                amount: 16.345199578200678,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "nisi cillum ex aute exercitation",
                  kegg_id: "nisi eu commodo ipsum",
                  structure: image,
                },
                amount: 19.541605486692553,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "laborum cupidatat Lorem deserunt",
                  kegg_id: "commodo nisi Ut",
                  structure: image,
                },
                amount: 16.57133491994439,
              },
            ],
          },
          yield: 4.2,
          deltaG: 13.448576662661974,
        },
        {
          stoichiometry: {
            reactants: [
              {
                molecule: {
                  name: "laborum",
                  smiles: "minim irure",
                  kegg_id: "amet in anim exercitation",
                  structure: image,
                },
                amount: 6.003905566127564,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "pariatur",
                  kegg_id: "voluptate minim",
                  structure: image,
                },
                amount: 19.049979957804208,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "amet ad sit veniam",
                  kegg_id: "aliquip in",
                  structure: image,
                },
                amount: 13.878973681908393,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "cupidatat commodo",
                  kegg_id: "dolore adipisicing",
                  structure: image,
                },
                amount: 5.924395078808123,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "in et dolore in sit",
                  kegg_id: "est dolore",
                  structure: image,
                },
                amount: 16.484444750792957,
              },
            ],
            products: [
              {
                molecule: {
                  name: "exercitation",
                  smiles: "culpa",
                  kegg_id: "aliqua",
                  structure: image,
                },
                amount: 2.9645715206094785,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "dolore Excepteur sunt consectetur sit",
                  kegg_id: "deserunt consequat veniam ea",
                  structure: image,
                },
                amount: 11.943199726570391,
              },
              {
                molecule: {
                  name: "id",
                  smiles: "in ullamco irure officia non",
                  kegg_id: "magna est proident ipsum do",
                  structure: image,
                },
                amount: 4.332428925299197,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "sed dolor eu sit",
                  kegg_id: "commodo mollit Excepteur",
                  structure: image,
                },
                amount: 19.023121105320957,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "officia velit",
                  kegg_id: "reprehenderit eu officia cillum cupidatat",
                  structure: image,
                },
                amount: 4.488612521809438,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "fugiat",
                  kegg_id: "non ullamco sed deserunt eiusmod",
                  structure: image,
                },
                amount: 3.4949400333465444,
              },
              {
                molecule: {
                  name: "consequat",
                  smiles: "ea",
                  kegg_id: "irure est",
                  structure: image,
                },
                amount: 15.810769914458614,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "deserunt",
                  kegg_id: "Ut cillum",
                  structure: image,
                },
                amount: 2.283469645915468,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "ex laboris in",
                  kegg_id: "aute",
                  structure: image,
                },
                amount: 11.618000155089236,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "in commodo sit",
                  kegg_id: "Lorem exercitation sunt",
                  structure: image,
                },
                amount: 9.628907812488588,
              },
            ],
          },
          yield: 5.2,
          deltaG: 11.831474808843259,
        },
        {
          stoichiometry: {
            reactants: [
              {
                molecule: {
                  name: "N/A",
                  smiles: "id labore irure reprehenderit exercitation",
                  kegg_id: "id",
                  structure: image,
                },
                amount: 13.904847346819313,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "commodo cillum sed consequat reprehenderit",
                  kegg_id: "enim",
                  structure: image,
                },
                amount: 2.769608755365973,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "non magna dolore sit Excepteur",
                  kegg_id: "nostrud nisi ex proident fugiat",
                  structure: image,
                },
                amount: 10.51574167117506,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "consectetur in sunt eu",
                  kegg_id: "non",
                  structure: image,
                },
                amount: 19.285279216688302,
              },
            ],
            products: [
              {
                molecule: {
                  name: "N/A",
                  smiles: "mollit esse",
                  kegg_id: "voluptate",
                  structure: image,
                },
                amount: 12.456345474478553,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "cupidatat in do dolor in",
                  kegg_id: "laboris dolor adipisicing",
                  structure: image,
                },
                amount: 11.99812612881462,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "fugiat et officia",
                  kegg_id: "aliqua id",
                  structure: image,
                },
                amount: 14.87164185982841,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "culpa laboris ea",
                  kegg_id: "aliquip dolore",
                  structure: image,
                },
                amount: 2.8468519349065344,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "ut",
                  kegg_id: "elit enim",
                  structure: image,
                },
                amount: 17.29261585756284,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "adipisicing dolor reprehenderit",
                  kegg_id: "sint Excepteur sed",
                  structure: image,
                },
                amount: 5.026391081214174,
              },
              {
                molecule: {
                  name: "N/A",
                  smiles: "Ut",
                  kegg_id: "qui labore dolor mollit adipisicing",
                  structure: image,
                },
                amount: 1.9213166173446736,
              },
              {
                molecule: {
                  name: "Lorem",
                  smiles: "ullamco",
                  kegg_id: "sed in sunt ad",
                  structure: image,
                },
                amount: 1.4334491484541818,
              },
            ],
          },
          yield: 7.6,
          deltaG: 11.689771723359286,
        },
      ],
    };
  }
}
