import { Component } from "@angular/core";
import { NovostoicTools } from "~/app/enums/novostoic-tools";
import { ToolStatus } from "~/app/enums/tool-status";
import { NOVOSTOIC_TOOLS_STATUS_MAP } from "~/app/constants/novostoic-tools-status";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
  readonly NovostoicTools = NovostoicTools;
  readonly NOVOSTOIC_TOOLS_STATUS_MAP = NOVOSTOIC_TOOLS_STATUS_MAP;
  readonly ToolStatus = ToolStatus;

  selectedTool$ = new BehaviorSubject(NovostoicTools.OVERALL_STOICHIOMETRY);
  collapsed$ = new BehaviorSubject(false);
}
