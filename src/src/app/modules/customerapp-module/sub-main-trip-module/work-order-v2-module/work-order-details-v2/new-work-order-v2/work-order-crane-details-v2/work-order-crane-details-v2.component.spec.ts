import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderCraneDetailsV2Component } from './work-order-crane-details-v2.component';

describe('WorkOrderCraneDetailsV2Component', () => {
  let component: WorkOrderCraneDetailsV2Component;
  let fixture: ComponentFixture<WorkOrderCraneDetailsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderCraneDetailsV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderCraneDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
