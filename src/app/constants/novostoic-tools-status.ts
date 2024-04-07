import { NovostoicTools } from "../enums/novostoic-tools";
import { ToolStatus } from "../enums/tool-status";

export const NOVOSTOIC_TOOLS_STATUS_MAP: Record<NovostoicTools, ToolStatus> = {
  [NovostoicTools.OVERALL_STOICHIOMETRY]: ToolStatus.RUNNING,
  [NovostoicTools.PATHWAY_SEARCH]: ToolStatus.RUNNING,
  [NovostoicTools.THERMODYNAMICAL_FEASIBILITY]: ToolStatus.DISABLED,
  [NovostoicTools.ENZYME_ACTIVITY]: ToolStatus.DISABLED,
  [NovostoicTools.NA]: ToolStatus.DISABLED,
};
