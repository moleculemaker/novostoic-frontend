import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwaySearchResultComponent } from './pathway-search-result.component';

describe('PathwaySearchResultComponent', () => {
  let component: PathwaySearchResultComponent;
  let fixture: ComponentFixture<PathwaySearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathwaySearchResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathwaySearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
