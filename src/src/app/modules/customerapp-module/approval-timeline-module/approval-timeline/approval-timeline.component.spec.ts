import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTimelineComponent } from './approval-timeline.component';

describe('ApprovalTimelineComponent', () => {
  let component: ApprovalTimelineComponent;
  let fixture: ComponentFixture<ApprovalTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalTimelineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
