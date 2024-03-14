import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { OverallStoichiometryComponent } from "./components/novostoic/overall-stoichiometry/overall-stoichiometry.component";
import { AboutNovostoicComponent } from "./components/novostoic/about-novostoic/about-novostoic.component";
import { OverallStoichiometryResultComponent } from "./components/novostoic/overall-stoichiometry-result/overall-stoichiometry-result.component";
import { PathwaySearchComponent } from "./components/novostoic/pathway-search/pathway-search.component";

const routes: Routes = [
  { path: "about", component: AboutNovostoicComponent },
  { path: "overall-stoichiometry", component: OverallStoichiometryComponent },
  {
    path: "overall-stoichiometry/result",
    component: OverallStoichiometryResultComponent,
  },
  { path: "pathway-search", component: PathwaySearchComponent },
  { path: "", component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
