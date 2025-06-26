import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceJobCardComponent } from './maintenance-job-card.component';

describe('MaintenanceJobCardComponent', () => {
  let component: MaintenanceJobCardComponent;
  let fixture: ComponentFixture<MaintenanceJobCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceJobCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceJobCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
