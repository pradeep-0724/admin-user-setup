import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderTenureStatusComponent } from './work-order-tenure-status.component';

describe('WorkOrderTenureStatusComponent', () => {
  let component: WorkOrderTenureStatusComponent;
  let fixture: ComponentFixture<WorkOrderTenureStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderTenureStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderTenureStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
