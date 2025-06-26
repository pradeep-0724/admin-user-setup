import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetApproveRejectPopupComponent } from './time-sheet-approve-reject-popup.component';

describe('TimeSheetApproveRejectPopupComponent', () => {
  let component: TimeSheetApproveRejectPopupComponent;
  let fixture: ComponentFixture<TimeSheetApproveRejectPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeSheetApproveRejectPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeSheetApproveRejectPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
