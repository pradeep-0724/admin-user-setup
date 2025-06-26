import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderSettingComponent } from './work-order-setting.component';

describe('WorkOrderSettingComponent', () => {
  let component: WorkOrderSettingComponent;
  let fixture: ComponentFixture<WorkOrderSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrderSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
