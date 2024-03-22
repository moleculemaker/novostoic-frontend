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
    request.form.controls["primaryPrecursor"].setValue("CC(=O)C(=O)O");
    request.form.controls["enzymeSequence"].setValue(
      ">sp|P68871|HBB_HUMAN Hemoglobin subunit beta OS=Homo sapiens GN=HBB PE=1 SV=2MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVLDNLKGTFATLSELHCDKLHVDPENFRLLGNHGKKVLGAFSDGLAHLDNLKGTFATLSELHLKGTFLKGTF",
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
      smiles: "ex consequat sit adipisicing commodo",
      commonNames: ["mollit", "do sunt eiusmod Lorem dolor", "cillum"],
      keggId: "proident",
      structure: "",
    },
    enzymeSequence:
      ">sp|P68871|HBB_HUMAN Hemoglobin subunit beta OS=Homo sapiens GN=HBB PE=1 SV=2MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVLDNLKGTFATLSELHCDKLHVDPENFRLLGNHGKKVLGAFSDGLAHLDNLKGTFATLSELHLKGTFLKGTF",
    activityScore: 0.9,
  };
}
