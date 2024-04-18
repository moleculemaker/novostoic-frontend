import { Component } from "@angular/core";
import { EnzymeSelectionResponse } from "~/app/models/enz-rank";

@Component({
  selector: "app-enz-rank-result",
  templateUrl: "./enz-rank-result.component.html",
  styleUrls: ["./enz-rank-result.component.scss"],
})
export class EnzRankResultComponent {
  response = EnzymeSelectionResponse.example;
  loading = false;
  jobId = "exampleJobId";
  submissionTime = "example submission time";

  exportCSV() {}
}
