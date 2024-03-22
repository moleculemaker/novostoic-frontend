import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnzRankResultComponent } from './enz-rank-result.component';

describe('EnzRankResultComponent', () => {
  let component: EnzRankResultComponent;
  let fixture: ComponentFixture<EnzRankResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnzRankResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnzRankResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
