import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { OverallStoichiometryComponent } from "./components/novostoic/overall-stoichiometry/overall-stoichiometry.component";
import { AboutNovostoicComponent } from "./components/novostoic/about-novostoic/about-novostoic.component";
import { OverallStoichiometryResultComponent } from "./components/novostoic/overall-stoichiometry-result/overall-stoichiometry-result.component";
import { DgPredictorComponent } from "./components/novostoic/dg-predictor/dg-predictor.component";
import { DgPredictorResultComponent } from "./components/novostoic/dg-predictor-result/dg-predictor-result.component";

const routes: Routes = [
  { path: "about", component: AboutNovostoicComponent },
  { path: "overall-stoichiometry", component: OverallStoichiometryComponent },
  {
    path: "overall-stoichiometry/result",
    component: OverallStoichiometryResultComponent,
  },
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
