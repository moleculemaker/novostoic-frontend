import { transition, style, animate, trigger } from "@angular/animations";
import { Component } from "@angular/core";
import { RouterModule, Routes, Router } from "@angular/router";
import { BehaviorSubject, combineLatest, map, switchMap } from "rxjs";

enum NovostoicTools {
  OVERALL_STOICHIOMETRY,
  PATHWAY_SEARCH,
  THERMODYNAMICAL_FEASIBILITY,
  ENZYME_ACTIVITY,
  NA,
}

const showTransition = transition(":enter", [
  style({ opacity: 0 }),
  animate(".2s ease-in", style({ opacity: 1 })),
]);
const fadeIn = trigger("fadeIn", [showTransition]);

@Component({
  selector: "landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
  animations: [fadeIn],
})
export class LandingPageComponent {
  researchNeeds = [
    {
      label: "a target molecule and a precursor -> overall stoichiometry",
      value: NovostoicTools.OVERALL_STOICHIOMETRY,
    },
    {
      label: "an overall stoichiometry -> pathways",
      value: NovostoicTools.PATHWAY_SEARCH,
    },
    {
      label: "pathways/reactions -> Gibbs Free Energy",
      value: NovostoicTools.THERMODYNAMICAL_FEASIBILITY,
    },
    {
      label: "pathways/reactions -> enzyme candidates",
      value: NovostoicTools.ENZYME_ACTIVITY,
    },
  ];

  selectedResearchNeed$ = new BehaviorSubject(NovostoicTools.NA);
  displayedResearchNeed$ = new BehaviorSubject(NovostoicTools.NA);

  get NovostoicTools() {
    return NovostoicTools;
  }

  constructor(private router: Router) {}
}
