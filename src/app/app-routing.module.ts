import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { OverallStoichiometryComponent } from "./components/novostoic/overall-stoichiometry/overall-stoichiometry.component";
import { AboutNovostoicComponent } from "./components/novostoic/about-novostoic/about-novostoic.component";
import { OverallStoichiometryResultComponent } from "./components/novostoic/overall-stoichiometry-result/overall-stoichiometry-result.component";
import { EnzRankComponent } from "./components/novostoic/enz-rank/enz-rank.component";
import { EnzRankResultComponent } from "./components/novostoic/enz-rank-result/enz-rank-result.component";
import { PathwaySearchComponent } from "./components/novostoic/pathway-search/pathway-search.component";
import { PathwaySearchResultComponent } from "./components/novostoic/pathway-search-result/pathway-search-result.component";
import { DgPredictorComponent } from "./components/novostoic/dg-predictor/dg-predictor.component";
import { DgPredictorResultComponent } from "./components/novostoic/dg-predictor-result/dg-predictor-result.component";

const routes: Routes = [
  { path: "about", component: AboutNovostoicComponent },
  { path: "overall-stoichiometry", component: OverallStoichiometryComponent },
  {
    path: "overall-stoichiometry/result",
    component: OverallStoichiometryResultComponent,
  },
  { path: "enzyme-selection", component: EnzRankComponent },
  { path: "enzyme-selection/result", component: EnzRankResultComponent },
  { path: "pathway-search", component: PathwaySearchComponent },
  { path: "pathway-search/result", component: PathwaySearchResultComponent },
  { path: "thermodynamical-feasibility", component: DgPredictorComponent },
  {
    path: "thermodynamical-feasibility/result",
    component: DgPredictorResultComponent,
  },
  { path: "", component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
