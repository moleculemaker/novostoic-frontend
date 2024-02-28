import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutNovostoicComponent } from './about-novostoic.component';

describe('AboutNovostoicComponent', () => {
  let component: AboutNovostoicComponent;
  let fixture: ComponentFixture<AboutNovostoicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutNovostoicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutNovostoicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
