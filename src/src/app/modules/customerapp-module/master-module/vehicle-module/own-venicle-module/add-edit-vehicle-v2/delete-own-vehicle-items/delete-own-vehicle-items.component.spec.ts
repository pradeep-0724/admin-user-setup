import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOwnVehicleItemsComponent } from './delete-own-vehicle-items.component';

describe('DeleteOwnVehicleItemsComponent', () => {
  let component: DeleteOwnVehicleItemsComponent;
  let fixture: ComponentFixture<DeleteOwnVehicleItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteOwnVehicleItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteOwnVehicleItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
