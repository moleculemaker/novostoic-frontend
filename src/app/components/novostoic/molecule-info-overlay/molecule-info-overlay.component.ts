import { Component, Input, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ChemicalAutoCompleteResponse } from '~/app/api/mmli-backend/v1';
import { NovostoicMolecule } from '~/app/models/overall-stoichiometry';

@Component({
  selector: 'app-molecule-info-overlay',
  templateUrl: './molecule-info-overlay.component.html',
  styleUrls: ['./molecule-info-overlay.component.scss']
})
export class MoleculeInfoOverlayComponent {
  @Input() molecule: NovostoicMolecule | Partial<ChemicalAutoCompleteResponse>;
  @Input() showSmiles: boolean;
  @Input() imageBorderStyle: string;
  @ViewChild('overlay') overlay: OverlayPanel;

  hide() {
    this.overlay.hide();
  }

  show($event: MouseEvent) {
    this.overlay.show($event);
  }
}
