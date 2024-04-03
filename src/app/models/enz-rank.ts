import { FormControl, FormGroup, Validators } from "@angular/forms";
import { JobCreate } from "../api/mmli-backend/v1";
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
    request.form.controls["primaryPrecursor"].setValue("O[C@@H](CC([O-])=O)C([O-])=O");
    request.form.controls["enzymeSequence"].setValue(
      "A0A4P8WFA8:MTKRVLVTGGAGFLGSHLCERLLSEGHEVICLDNFGSGRRKNIKEFEDHPSFKVNDRDVRISESLPSVDRIYHLASRASPADFTQFPVNIALANTQGTRRLLDQARACDARMVFASTSEVYGDPKVHPQPETYTGNVNIRGARGCYDESKRFGETLTVAYQRKYDVDARTVRIFNTYGPRMRPDDGRVVPTFVTQALRGDDLTIYGDGEQTRSFCYVDDLIEGLISLMRVDNPEHNVYNIGKENERTIKELAYEVLGLTDTESDIVYEPLPEDDPGQRRPDITRAKTELDWEPKISLREGLEDTITYFDN",
    );
    return request;
  }

  clearAll() {
    Object.values(this.form.controls).forEach((control) => control.reset());
  }

  toJobCreate(): JobCreate {
    return {
      job_info: JSON.stringify({
        primaryPrecursor: this.form.controls["primaryPrecursor"].value,
        enzymeSequence: this.form.controls["enzymeSequence"].value,
      }),
      email: this.form.controls["subscriberEmail"].value || "",
      job_id: undefined,
      run_id: 0,
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
      commonNames: ["L-2-Hydroxybutanedioic acid"],
      keggId: "C00149",
      structure: "https://www.genome.jp/Fig/compound/C00149.gif",
    },
    enzymeSequence:
      "A0A4P8WFA8:MTKRVLVTGGAGFLGSHLCERLLSEGHEVICLDNFGSGRRKNIKEFEDHPSFKVNDRDVRISESLPSVDRIYHLASRASPADFTQFPVNIALANTQGTRRLLDQARACDARMVFASTSEVYGDPKVHPQPETYTGNVNIRGARGCYDESKRFGETLTVAYQRKYDVDARTVRIFNTYGPRMRPDDGRVVPTFVTQALRGDDLTIYGDGEQTRSFCYVDDLIEGLISLMRVDNPEHNVYNIGKENERTIKELAYEVLGLTDTESDIVYEPLPEDDPGQRRPDITRAKTELDWEPKISLREGLEDTITYFDN",
    activityScore: 0.50553495,
  };
}
