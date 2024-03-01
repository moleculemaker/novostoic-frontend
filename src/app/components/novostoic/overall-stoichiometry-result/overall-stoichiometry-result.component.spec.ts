import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallStoichiometryResultComponent } from './overall-stoichiometry-result.component';

describe('OverallStoichiometryResultComponent', () => {
  let component: OverallStoichiometryResultComponent;
  let fixture: ComponentFixture<OverallStoichiometryResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallStoichiometryResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallStoichiometryResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
