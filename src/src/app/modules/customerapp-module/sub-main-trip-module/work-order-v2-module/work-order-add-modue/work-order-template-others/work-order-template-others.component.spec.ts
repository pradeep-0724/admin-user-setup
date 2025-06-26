import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderTemplateOthersComponent } from './work-order-template-others.component';

describe('WorkOrderTemplateOthersComponent', () => {
  let component: WorkOrderTemplateOthersComponent;
  let fixture: ComponentFixture<WorkOrderTemplateOthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderTemplateOthersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderTemplateOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
