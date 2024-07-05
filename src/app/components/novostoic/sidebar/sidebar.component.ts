import { Component, Input, OnInit } from "@angular/core";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { ToolStatus } from "~/app/enums/tool-status";
import { NOVOSTOIC_TOOLS_STATUS_MAP } from "~/app/constants/novostoic-tools-status";
import { BehaviorSubject, map } from "rxjs";
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

  selectedTool$ = new BehaviorSubject(NovostoicTools.NA);
  collapsed$ = new BehaviorSubject(false);

  fillColorsMap$ = this.selectedTool$.pipe(
    map((tool) => {
      const isDisabled = this.NOVOSTOIC_TOOLS_STATUS_MAP[tool] === ToolStatus.DISABLED; 
      const isSelected = (t: NovostoicTools) => t === tool;
      const disabledColor = "#bdbdbd";
      const activeColor = "#224063";
      const normalColor = "#757575";
      return {
        [NovostoicTools.NA]: isDisabled ? disabledColor : isSelected(NovostoicTools.NA) ? activeColor : normalColor,
        [NovostoicTools.OVERALL_STOICHIOMETRY]: isDisabled ? disabledColor : isSelected(NovostoicTools.OVERALL_STOICHIOMETRY) ? activeColor : normalColor,
        [NovostoicTools.PATHWAY_SEARCH]: isDisabled ? disabledColor : isSelected(NovostoicTools.PATHWAY_SEARCH) ? activeColor : normalColor,
        [NovostoicTools.THERMODYNAMICAL_FEASIBILITY]: isDisabled ? disabledColor : isSelected(NovostoicTools.THERMODYNAMICAL_FEASIBILITY) ? activeColor : normalColor,
        [NovostoicTools.ENZYME_ACTIVITY]: isDisabled ? disabledColor : isSelected(NovostoicTools.ENZYME_ACTIVITY) ? activeColor : normalColor,
      }
    })
  );

  constructor(private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url;
    let possibleTool = url.split("/")[1];
    if (possibleTool.indexOf("?") !== -1) {
      possibleTool = possibleTool.split("?")[0];
    }
    this.selectedTool$.next(possibleTool as NovostoicTools);
  }
}
