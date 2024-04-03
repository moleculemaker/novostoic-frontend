import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { OverallStoichiometryComponent } from './components/novostoic/overall-stoichiometry/overall-stoichiometry.component';
import { AboutNovostoicComponent } from './components/novostoic/about-novostoic/about-novostoic.component';
import { OverallStoichiometryResultComponent } from './components/novostoic/overall-stoichiometry-result/overall-stoichiometry-result.component';
import { MainLayoutComponent } from './components/novostoic/main-layout/main-layout.component';

const routes: Routes = [
  { path: 'about', component: AboutNovostoicComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'overall-stoichiometry',
        component: OverallStoichiometryComponent,
      },
      {
        path: 'overall-stoichiometry/result',
        component: OverallStoichiometryResultComponent,
      },
    ],
  },
  { path: 'home', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
