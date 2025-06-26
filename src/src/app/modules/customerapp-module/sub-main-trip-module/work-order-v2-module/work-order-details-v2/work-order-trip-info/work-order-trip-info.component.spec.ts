import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderTripInfoComponent } from './work-order-trip-info.component';

describe('WorkOrderTripInfoComponent', () => {
  let component: WorkOrderTripInfoComponent;
  let fixture: ComponentFixture<WorkOrderTripInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderTripInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderTripInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
