import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverAppAccessManagementComponent } from './driver-app-access-management.component';

describe('DriverAppAccessManagementComponent', () => {
  let component: DriverAppAccessManagementComponent;
  let fixture: ComponentFixture<DriverAppAccessManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverAppAccessManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverAppAccessManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
