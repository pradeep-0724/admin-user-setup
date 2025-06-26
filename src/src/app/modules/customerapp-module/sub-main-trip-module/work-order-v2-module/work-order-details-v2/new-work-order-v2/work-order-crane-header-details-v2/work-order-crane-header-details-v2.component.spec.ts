import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderCraneHeaderDetailsV2Component } from './work-order-crane-header-details-v2.component';

describe('WorkOrderCraneHeaderDetailsV2Component', () => {
  let component: WorkOrderCraneHeaderDetailsV2Component;
  let fixture: ComponentFixture<WorkOrderCraneHeaderDetailsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderCraneHeaderDetailsV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderCraneHeaderDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
