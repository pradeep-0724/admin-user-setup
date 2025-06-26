import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderSettingValidationsComponent } from './work-order-setting-validations.component';

describe('WorkOrderSettingValidationsComponent', () => {
  let component: WorkOrderSettingValidationsComponent;
  let fixture: ComponentFixture<WorkOrderSettingValidationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderSettingValidationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderSettingValidationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
