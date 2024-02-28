import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { AboutNovostoicComponent } from "./components/novostoic/about-novostoic/about-novostoic.component";

const routes: Routes = [
  { path: "about", component: AboutNovostoicComponent },
  { path: "", component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
