import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderDetailsV2Component } from './work-order-details-v2.component';

describe('WorkOrderDetailsV2Component', () => {
  let component: WorkOrderDetailsV2Component;
  let fixture: ComponentFixture<WorkOrderDetailsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderDetailsV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
