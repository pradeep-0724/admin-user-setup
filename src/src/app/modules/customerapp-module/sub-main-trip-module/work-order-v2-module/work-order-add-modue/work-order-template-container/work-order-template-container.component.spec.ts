import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderTemplateContainerComponent } from './work-order-template-container.component';

describe('WorkOrderTemplateContainerComponent', () => {
  let component: WorkOrderTemplateContainerComponent;
  let fixture: ComponentFixture<WorkOrderTemplateContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderTemplateContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderTemplateContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
