import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCertifcatesHistoryComponent } from './vehicle-certifcates-history.component';

describe('VehicleCertifcatesHistoryComponent', () => {
  let component: VehicleCertifcatesHistoryComponent;
  let fixture: ComponentFixture<VehicleCertifcatesHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleCertifcatesHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleCertifcatesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
