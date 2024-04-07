import { Component } from "@angular/core";
import { of } from "rxjs";
import { ThermodynamicalFeasibilityResponse } from "~/app/models/dg-predictor";

@Component({
  selector: "app-dg-predictor-result",
  templateUrl: "./dg-predictor-result.component.html",
  styleUrls: ["./dg-predictor-result.component.scss"],
  host: {
    class: "grow",
  },
})
export class DgPredictorResultComponent {
  jobId = "exampleJobId";
  submissionTime = "example submission time";
  loading = false;

  response = ThermodynamicalFeasibilityResponse.example;
  columnsForExport = [
    { field: "reaction", header: "Reaction" },
    {
      field: "gibbsEnergy",
      header: "Gibbs Free Energy(kJ/mol)",
    },
  ];
}
