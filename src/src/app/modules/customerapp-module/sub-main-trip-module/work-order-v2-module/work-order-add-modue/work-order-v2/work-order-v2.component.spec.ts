import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderV2Component } from './work-order-v2.component';

describe('WorkOrderV2Component', () => {
  let component: WorkOrderV2Component;
  let fixture: ComponentFixture<WorkOrderV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
