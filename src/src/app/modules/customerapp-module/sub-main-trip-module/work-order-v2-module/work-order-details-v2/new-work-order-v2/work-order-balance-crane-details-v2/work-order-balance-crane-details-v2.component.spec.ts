import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderBalanceCraneDetailsV2Component } from './work-order-balance-crane-details-v2.component';

describe('WorkOrderBalanceCraneDetailsV2Component', () => {
  let component: WorkOrderBalanceCraneDetailsV2Component;
  let fixture: ComponentFixture<WorkOrderBalanceCraneDetailsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderBalanceCraneDetailsV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderBalanceCraneDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
