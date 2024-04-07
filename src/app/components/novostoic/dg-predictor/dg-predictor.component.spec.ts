import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgPredictorComponent } from './dg-predictor.component';

describe('DgPredictorComponent', () => {
  let component: DgPredictorComponent;
  let fixture: ComponentFixture<DgPredictorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgPredictorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DgPredictorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
