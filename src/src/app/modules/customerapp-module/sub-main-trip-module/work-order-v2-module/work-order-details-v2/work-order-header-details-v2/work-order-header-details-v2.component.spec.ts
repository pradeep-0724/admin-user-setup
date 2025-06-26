import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderHeaderDetailsV2Component } from './work-order-header-details-v2.component';

describe('WorkOrderHeaderDetailsV2Component', () => {
  let component: WorkOrderHeaderDetailsV2Component;
  let fixture: ComponentFixture<WorkOrderHeaderDetailsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderHeaderDetailsV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderHeaderDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
