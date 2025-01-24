import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculeInputWithAmountComponent } from './molecule-input-with-amount.component';

describe('MoleculeInputWithAmountComponent', () => {
  let component: MoleculeInputWithAmountComponent;
  let fixture: ComponentFixture<MoleculeInputWithAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoleculeInputWithAmountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoleculeInputWithAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
