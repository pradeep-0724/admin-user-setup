import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleDocumentPopupComponent } from './add-vehicle-document-popup.component';

describe('AddVehicleDocumentPopupComponent', () => {
  let component: AddVehicleDocumentPopupComponent;
  let fixture: ComponentFixture<AddVehicleDocumentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVehicleDocumentPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVehicleDocumentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
