import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOwnVehicleItemsComponent } from './add-edit-own-vehicle-items.component';

describe('AddEditOwnVehicleItemsComponent', () => {
  let component: AddEditOwnVehicleItemsComponent;
  let fixture: ComponentFixture<AddEditOwnVehicleItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditOwnVehicleItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditOwnVehicleItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
