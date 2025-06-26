import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderViewContainerAddEditComponent } from './work-order-view-container-add-edit.component';

describe('WorkOrderViewContainerAddEditComponent', () => {
  let component: WorkOrderViewContainerAddEditComponent;
  let fixture: ComponentFixture<WorkOrderViewContainerAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderViewContainerAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderViewContainerAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
