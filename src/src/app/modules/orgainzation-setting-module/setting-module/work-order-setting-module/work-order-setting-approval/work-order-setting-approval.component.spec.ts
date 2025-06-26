import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderSettingApprovalComponent } from './work-order-setting-approval.component';

describe('WorkOrderSettingApprovalComponent', () => {
  let component: WorkOrderSettingApprovalComponent;
  let fixture: ComponentFixture<WorkOrderSettingApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderSettingApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderSettingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
