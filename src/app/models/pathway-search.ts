import { FormGroup, FormControl, Validators } from "@angular/forms";
import { JobCreate } from "../api/mmli-backend/v1";

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

export class PathwaySearchResponse {}
