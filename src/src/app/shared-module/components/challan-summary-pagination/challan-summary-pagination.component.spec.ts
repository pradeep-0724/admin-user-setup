import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanSummaryPaginationComponent } from './challan-summary-pagination.component';

describe('ChallanSummaryPaginationComponent', () => {
  let component: ChallanSummaryPaginationComponent;
  let fixture: ComponentFixture<ChallanSummaryPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallanSummaryPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallanSummaryPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
