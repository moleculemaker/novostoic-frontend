import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { OverallStoichiometryComponent } from './components/novostoic/overall-stoichiometry/overall-stoichiometry.component';
import { AboutNovostoicComponent } from "./components/novostoic/about-novostoic/about-novostoic.component";

const routes: Routes = [
  { path: "about", component: AboutNovostoicComponent },
  { path: "overall-stoichiometry", component: OverallStoichiometryComponent },
  { path: "", component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
