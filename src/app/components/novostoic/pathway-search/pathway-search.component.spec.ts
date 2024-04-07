import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwaySearchComponent } from './pathway-search.component';

describe('PathwaySearchComponent', () => {
  let component: PathwaySearchComponent;
  let fixture: ComponentFixture<PathwaySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathwaySearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathwaySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
