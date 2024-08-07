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
import { NovostoicTools } from "./enums/novostoic-tools";
import { MainLayoutComponent } from "./components/novostoic/main-layout/main-layout.component";
import { CenterLayoutComponent } from "./components/novostoic/center-layout/center-layout.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { 
        path: NovostoicTools.OVERALL_STOICHIOMETRY, 
        component: OverallStoichiometryComponent 
      },
      {
        path: NovostoicTools.OVERALL_STOICHIOMETRY + "/result/:id",
        component: OverallStoichiometryResultComponent,
      },
      { 
        path: NovostoicTools.ENZYME_ACTIVITY, 
        component: EnzRankComponent 
      },
      { 
        path: NovostoicTools.ENZYME_ACTIVITY + "/result/:id", 
        component: EnzRankResultComponent 
      },
      { 
        path: NovostoicTools.PATHWAY_SEARCH,
        component: PathwaySearchComponent 
      },
      { 
        path: NovostoicTools.PATHWAY_SEARCH + "/result/:id", 
        component: PathwaySearchResultComponent 
      },
      { 
        path: NovostoicTools.THERMODYNAMICAL_FEASIBILITY, 
        component: DgPredictorComponent 
      },
      {
        path: NovostoicTools.THERMODYNAMICAL_FEASIBILITY + "/result/:id",
        component: DgPredictorResultComponent,
      },
    ]
  },
  { 
    path: '', 
    component: CenterLayoutComponent,
    children: [
      {
        path: "home",
        component: LandingPageComponent,
      },
      {
        path: 'about',
        component: AboutNovostoicComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
