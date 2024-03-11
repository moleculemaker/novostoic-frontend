import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallStoichiometryComponent } from './overall-stoichiometry.component';

describe('OverallStoichiometryComponent', () => {
  let component: OverallStoichiometryComponent;
  let fixture: ComponentFixture<OverallStoichiometryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallStoichiometryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallStoichiometryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
