import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgPredictorResultComponent } from './dg-predictor-result.component';

describe('DgPredictorResultComponent', () => {
  let component: DgPredictorResultComponent;
  let fixture: ComponentFixture<DgPredictorResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgPredictorResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DgPredictorResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
