import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleNewDocumentPopupComponent } from './add-vehicle-new-document-popup.component';

describe('AddVehicleNewDocumentPopupComponent', () => {
  let component: AddVehicleNewDocumentPopupComponent;
  let fixture: ComponentFixture<AddVehicleNewDocumentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVehicleNewDocumentPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVehicleNewDocumentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
