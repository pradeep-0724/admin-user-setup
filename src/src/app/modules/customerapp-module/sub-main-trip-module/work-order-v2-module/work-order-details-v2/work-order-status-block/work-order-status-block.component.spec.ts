import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderStatusBlockComponent } from './work-order-status-block.component';

describe('WorkOrderStatusBlockComponent', () => {
  let component: WorkOrderStatusBlockComponent;
  let fixture: ComponentFixture<WorkOrderStatusBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderStatusBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderStatusBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
