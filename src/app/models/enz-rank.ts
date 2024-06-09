import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NovostoicMolecule } from "./overall-stoichiometry";

export class EnzymeSelectionRequest {
  form = new FormGroup({
    primaryPrecursor: new FormControl("", [Validators.required]),
    enzymeSequence: new FormControl("", [Validators.required]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
  });

  static example() {
    const request = new EnzymeSelectionRequest();
    request.form.controls["primaryPrecursor"].setValue("O[C@@H](CC(O)=O)C(O)=O");
    request.form.controls["enzymeSequence"].setValue(
      "A0A4P8WFA8:MTKRVLVTGGAGFLGSHLCERLLSEGHEVICLDNFGSGRRKNIKEFEDHPSFKVNDRDVRISESLPSVDRIYHLASRASPADFTQFPVNIALANTQGTRRLLDQARACDARMVFASTSEVYGDPKVHPQPETYTGNVNIRGARGCYDESKRFGETLTVAYQRKYDVDARTVRIFNTYGPRMRPDDGRVVPTFVTQALRGDDLTIYGDGEQTRSFCYVDDLIEGLISLMRVDNPEHNVYNIGKENERTIKELAYEVLGLTDTESDIVYEPLPEDDPGQRRPDITRAKTELDWEPKISLREGLEDTITYFDN",
    );
    return request;
  }

  clearAll() {
    Object.values(this.form.controls).forEach((control) => control.reset());
  }

  toRequestBody() {
    const jobInfo = {
      primary_precursor: this.form.controls["primaryPrecursor"].value || '',
      enzyme_sequences: [this.form.controls["enzymeSequence"].value?.replaceAll('\n', '') || ''],
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