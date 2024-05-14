import { Component, Input } from "@angular/core";
import {
  NovostoicMolecule,
  NovostoicStoichiometry,
} from "~/app/models/overall-stoichiometry";

@Component({
  selector: "app-stoichiometry-reaction",
  templateUrl: "./stoichiometry-reaction.component.html",
  styleUrls: ["./stoichiometry-reaction.component.scss"],
})
export class StoichiometryReactionComponent {
  @Input() stoichiometry: NovostoicStoichiometry;
  @Input() primaryPrecursor: NovostoicMolecule;
  @Input() targetMolecule: NovostoicMolecule;
  @Input() moleculeStyleClass: string = "bg-gray-50";
  @Input() showTargetMolecule: boolean = true;
}
