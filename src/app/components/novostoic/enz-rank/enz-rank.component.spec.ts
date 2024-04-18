import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnzRankComponent } from './enz-rank.component';

describe('EnzRankComponent', () => {
  let component: EnzRankComponent;
  let fixture: ComponentFixture<EnzRankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnzRankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnzRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
