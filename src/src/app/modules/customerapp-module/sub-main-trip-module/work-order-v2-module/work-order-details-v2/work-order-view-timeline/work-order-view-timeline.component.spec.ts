import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderViewTimelineComponent } from './work-order-view-timeline.component';

describe('WorkOrderViewTimelineComponent', () => {
  let component: WorkOrderViewTimelineComponent;
  let fixture: ComponentFixture<WorkOrderViewTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderViewTimelineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderViewTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
