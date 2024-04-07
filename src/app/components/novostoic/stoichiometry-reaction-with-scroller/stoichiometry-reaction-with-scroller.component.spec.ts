import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoichiometryReactionWithScrollerComponent } from './stoichiometry-reaction-with-scroller.component';

describe('StoichiometryReactionWithScrollerComponent', () => {
  let component: StoichiometryReactionWithScrollerComponent;
  let fixture: ComponentFixture<StoichiometryReactionWithScrollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoichiometryReactionWithScrollerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoichiometryReactionWithScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
