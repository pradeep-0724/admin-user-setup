import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewVehiclePopupComponent } from './add-new-vehicle-popup.component';

describe('AddNewVehiclePopupComponent', () => {
  let component: AddNewVehiclePopupComponent;
  let fixture: ComponentFixture<AddNewVehiclePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewVehiclePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewVehiclePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
