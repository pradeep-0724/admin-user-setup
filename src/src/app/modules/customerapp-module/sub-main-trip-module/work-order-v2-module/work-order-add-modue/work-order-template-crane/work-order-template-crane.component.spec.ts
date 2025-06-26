import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderTemplateCraneComponent } from './work-order-template-crane.component';

describe('WorkOrderTemplateCraneComponent', () => {
  let component: WorkOrderTemplateCraneComponent;
  let fixture: ComponentFixture<WorkOrderTemplateCraneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderTemplateCraneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderTemplateCraneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
