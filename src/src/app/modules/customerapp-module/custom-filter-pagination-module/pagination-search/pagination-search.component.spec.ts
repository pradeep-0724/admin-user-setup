import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationSearchComponent } from './pagination-search.component';

describe('PaginationSearchComponent', () => {
  let component: PaginationSearchComponent;
  let fixture: ComponentFixture<PaginationSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
