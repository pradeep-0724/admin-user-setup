import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderSettingPreferencesComponent } from './work-order-setting-preferences.component';

describe('WorkOrderSettingPreferencesComponent', () => {
  let component: WorkOrderSettingPreferencesComponent;
  let fixture: ComponentFixture<WorkOrderSettingPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrderSettingPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderSettingPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
