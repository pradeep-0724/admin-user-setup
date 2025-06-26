import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderListV2Component } from './work-order-list-v2.component';

describe('WorkOrderListV2Component', () => {
  let component: WorkOrderListV2Component;
  let fixture: ComponentFixture<WorkOrderListV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderListV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderListV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
