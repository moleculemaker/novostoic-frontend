import { Component, Input, OnInit } from "@angular/core";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { ToolStatus } from "~/app/enums/tool-status";
import { NOVOSTOIC_TOOLS_STATUS_MAP } from "~/app/constants/novostoic-tools-status";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @Input() openInNewPage = true;

  readonly NovostoicTools = NovostoicTools;
  readonly NOVOSTOIC_TOOLS_STATUS_MAP = NOVOSTOIC_TOOLS_STATUS_MAP;
  readonly ToolStatus = ToolStatus;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.router.url.includes("overall-stoichiometry")) {
      this.selectedTool$.next(NovostoicTools.OVERALL_STOICHIOMETRY);
    } else if (this.router.url.includes("pathway-search")) {
      this.selectedTool$.next(NovostoicTools.PATHWAY_SEARCH);
    } else if (this.router.url.includes("thermodynamical-feasibility")) {
      this.selectedTool$.next(NovostoicTools.THERMODYNAMICAL_FEASIBILITY);
    } else if (this.router.url.includes("enzyme-selection")) {
      this.selectedTool$.next(NovostoicTools.ENZYME_ACTIVITY);
    }
  }

  selectedTool$ = new BehaviorSubject(NovostoicTools.OVERALL_STOICHIOMETRY);
  collapsed$ = new BehaviorSubject(false);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url;
    if (url.includes("overall-stoichiometry")) {
      this.selectedTool$.next(NovostoicTools.OVERALL_STOICHIOMETRY);
    } else if (url.includes("pathway-search")) {
      this.selectedTool$.next(NovostoicTools.PATHWAY_SEARCH);
    } else if (url.includes("thermodynamical-feasibility")) {
      this.selectedTool$.next(NovostoicTools.THERMODYNAMICAL_FEASIBILITY);
    } else if (url.includes("enzyme-activity")) {
      this.selectedTool$.next(NovostoicTools.ENZYME_ACTIVITY);
    } else {
      this.selectedTool$.next(NovostoicTools.NA);
    }
  }
}
