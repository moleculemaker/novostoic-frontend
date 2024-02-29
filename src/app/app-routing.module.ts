import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { OverallStoichiometryComponent } from './components/novostoic/overall-stoichiometry/overall-stoichiometry.component';

const routes: Routes = [
  { path: 'overall-stoichiometry', component: OverallStoichiometryComponent },
  { path: '', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
