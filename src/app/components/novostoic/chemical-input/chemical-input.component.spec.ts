import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalInputComponent } from './chemical-input.component';

describe('ChemicalInputComponent', () => {
  let component: ChemicalInputComponent;
  let fixture: ComponentFixture<ChemicalInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChemicalInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
