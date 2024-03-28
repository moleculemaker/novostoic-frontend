import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NovostoicMolecule, NovostoicStoichiometry } from '~/app/models/overall-stoichiometry';

@Component({
  selector: 'app-stoichiometry-reaction-with-scroller',
  templateUrl: './stoichiometry-reaction-with-scroller.component.html',
  styleUrls: ['./stoichiometry-reaction-with-scroller.component.scss']
})
export class StoichiometryReactionWithScrollerComponent {
  @Input() primaryPrecursor: NovostoicMolecule;
  @Input() targetMolecule: NovostoicMolecule;
  @Input() stoichiometry: NovostoicStoichiometry;
  @Input() moleculeStyleClass: string;
  @Input() maxWidth: string;

  scrollingCounter$ = new BehaviorSubject(-1);

  startScrolling(container: HTMLElement, delta: number) {
    const timeoutId = setTimeout(() => {
      container.scrollLeft += delta;
      this.startScrolling(container, delta);
    }, 1);
    this.scrollingCounter$.next(timeoutId as unknown as number);
  }

  endScrolling() {
    clearTimeout(this.scrollingCounter$.value);
    this.scrollingCounter$.next(-1);
  }
}
