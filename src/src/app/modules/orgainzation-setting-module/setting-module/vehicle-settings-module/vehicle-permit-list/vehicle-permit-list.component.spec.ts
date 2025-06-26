import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePermitListComponent } from './vehicle-permit-list.component';

describe('VehiclePermitListComponent', () => {
  let component: VehiclePermitListComponent;
  let fixture: ComponentFixture<VehiclePermitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiclePermitListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclePermitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
