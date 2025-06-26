import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderSettingCustomFieldsComponent } from './work-order-setting-custom-fields.component';

describe('WorkOrderSettingCustomFieldsComponent', () => {
  let component: WorkOrderSettingCustomFieldsComponent;
  let fixture: ComponentFixture<WorkOrderSettingCustomFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrderSettingCustomFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderSettingCustomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
