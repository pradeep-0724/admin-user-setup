import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderRouteInfoComponent } from './work-order-route-info.component';

describe('WorkOrderRouteInfoComponent', () => {
  let component: WorkOrderRouteInfoComponent;
  let fixture: ComponentFixture<WorkOrderRouteInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderRouteInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderRouteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
