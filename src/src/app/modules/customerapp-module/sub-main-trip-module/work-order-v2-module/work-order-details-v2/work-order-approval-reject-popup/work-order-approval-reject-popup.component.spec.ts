import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderApprovalRejectPopupComponent } from './work-order-approval-reject-popup.component';

describe('WorkOrderApprovalRejectPopupComponent', () => {
  let component: WorkOrderApprovalRejectPopupComponent;
  let fixture: ComponentFixture<WorkOrderApprovalRejectPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderApprovalRejectPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderApprovalRejectPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
