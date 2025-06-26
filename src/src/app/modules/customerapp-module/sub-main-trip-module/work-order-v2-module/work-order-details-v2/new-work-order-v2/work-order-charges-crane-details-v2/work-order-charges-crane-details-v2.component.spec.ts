import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderChargesCraneDetailsV2Component } from './work-order-charges-crane-details-v2.component';

describe('WorkOrderChargesCraneDetailsV2Component', () => {
  let component: WorkOrderChargesCraneDetailsV2Component;
  let fixture: ComponentFixture<WorkOrderChargesCraneDetailsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderChargesCraneDetailsV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderChargesCraneDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
