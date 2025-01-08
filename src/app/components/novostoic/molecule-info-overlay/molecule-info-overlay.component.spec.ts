import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculeInfoOverlayComponent } from './molecule-info-overlay.component';

describe('MoleculeInfoOverlayComponent', () => {
  let component: MoleculeInfoOverlayComponent;
  let fixture: ComponentFixture<MoleculeInfoOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoleculeInfoOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoleculeInfoOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
