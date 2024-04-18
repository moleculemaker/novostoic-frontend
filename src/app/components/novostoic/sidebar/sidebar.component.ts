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

  selectedTool$ = new BehaviorSubject(NovostoicTools.NA);
  collapsed$ = new BehaviorSubject(false);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url;
    const tool = url.split("/")[1];
    this.selectedTool$.next(tool as NovostoicTools);
  }
}
