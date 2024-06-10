import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NovostoicMolecule } from "./overall-stoichiometry";
import { ChemicalAutoCompleteResponse } from "../api/mmli-backend/v1";

export class EnzymeSelectionRequest {
  form = new FormGroup({
    primaryPrecursor: new FormControl("", [Validators.required]),
    enzymeSequence: new FormControl("", [Validators.required]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
  });

  primaryPrecursor: ChemicalAutoCompleteResponse | null;

  static example() {
    const request = new EnzymeSelectionRequest();
    request.form.controls["primaryPrecursor"].setValue("O[C@@H](CC(O)=O)C(O)=O");
    request.primaryPrecursor = {
      "name": "(S)-malate",
      "smiles": "O=C(O)C[C@H](O)C(=O)O",
      "inchi": "InChI=1S/C4H6O5/c5-2(4(8)9)1-3(6)7/h2,5H,1H2,(H,6,7)(H,8,9)/p-2/t2-/m0/s1",
      "inchi_key": "InChIKey=BJEPYKJPYRNKOW-REOHCLBHSA-L",
      "metanetx_id": "MNXM1107192",
      "kegg_id": "C00149",
    }
    request.form.controls["enzymeSequence"].setValue(
      "A0A4P8WFA8:MTKRVLVTGGAGFLGSHLCERLLSEGHEVICLDNFGSGRRKNIKEFEDHPSFKVNDRDVRISESLPSVDRIYHLASRASPADFTQFPVNIALANTQGTRRLLDQARACDARMVFASTSEVYGDPKVHPQPETYTGNVNIRGARGCYDESKRFGETLTVAYQRKYDVDARTVRIFNTYGPRMRPDDGRVVPTFVTQALRGDDLTIYGDGEQTRSFCYVDDLIEGLISLMRVDNPEHNVYNIGKENERTIKELAYEVLGLTDTESDIVYEPLPEDDPGQRRPDITRAKTELDWEPKISLREGLEDTITYFDN",
    );
    return request;
  }

  clearAll() {
    Object.values(this.form.controls).forEach((control) => control.reset());
    this.primaryPrecursor = null;
  }

  setPrimaryPrecursor(molecule: ChemicalAutoCompleteResponse) {
    this.primaryPrecursor = molecule;
  }

  toRequestBody() {
    if (!this.primaryPrecursor) {
      throw new Error("Primary precursor not set");
    }
    const jobInfo = {
      primary_precursor: 'N00001',
      add_info: `N00001:${this.primaryPrecursor.smiles}`,
      enzyme_sequences: [this.form.controls["enzymeSequence"].value?.replaceAll('\\n', '') || ''],
    };
    return {
      job_info: JSON.stringify(jobInfo),
      email: this.form.controls["subscriberEmail"].value || "",
    };
  }
}

export class EnzymeSelectionResponse {
  primaryPrecursor: NovostoicMolecule;
  enzymeSequence: string;
  activityScore: number;

  static example: EnzymeSelectionResponse = {
    primaryPrecursor: {
      smiles: "O[C@@H](CC([O-])=O)C([O-])=O",
      name: "N/A",
      kegg_id: "C00149",
      structure: "https://www.genome.jp/Fig/compound/C00149.gif",
    },
    enzymeSequence:
      "A0A4P8WFA8:MTKRVLVTGGAGFLGSHLCERLLSEGHEVICLDNFGSGRRKNIKEFEDHPSFKVNDRDVRISESLPSVDRIYHLASRASPADFTQFPVNIALANTQGTRRLLDQARACDARMVFASTSEVYGDPKVHPQPETYTGNVNIRGARGCYDESKRFGETLTVAYQRKYDVDARTVRIFNTYGPRMRPDDGRVVPTFVTQALRGDDLTIYGDGEQTRSFCYVDDLIEGLISLMRVDNPEHNVYNIGKENERTIKELAYEVLGLTDTESDIVYEPLPEDDPGQRRPDITRAKTELDWEPKISLREGLEDTITYFDN",
    activityScore: 0.50553495,
  };
}