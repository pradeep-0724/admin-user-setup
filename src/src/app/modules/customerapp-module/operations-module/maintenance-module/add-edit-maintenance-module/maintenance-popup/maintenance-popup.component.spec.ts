import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePopupComponent } from './maintenance-popup.component';

describe('MaintenancePopupComponent', () => {
  let component: MaintenancePopupComponent;
  let fixture: ComponentFixture<MaintenancePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenancePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenancePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
