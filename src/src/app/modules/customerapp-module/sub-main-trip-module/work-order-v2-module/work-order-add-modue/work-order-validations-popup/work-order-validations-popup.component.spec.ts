import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderValidationsPopupComponent } from './work-order-validations-popup.component';

describe('WorkOrderValidationsPopupComponent', () => {
  let component: WorkOrderValidationsPopupComponent;
  let fixture: ComponentFixture<WorkOrderValidationsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderValidationsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderValidationsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
