import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoichiometryReactionComponent } from './stoichiometry-reaction.component';

describe('StoichiometryReactionComponent', () => {
  let component: StoichiometryReactionComponent;
  let fixture: ComponentFixture<StoichiometryReactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoichiometryReactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoichiometryReactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
