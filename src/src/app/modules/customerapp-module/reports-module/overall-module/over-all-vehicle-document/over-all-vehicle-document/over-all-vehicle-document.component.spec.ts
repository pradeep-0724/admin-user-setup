import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverAllVehicleDocumentComponent } from './over-all-vehicle-document.component';

describe('OverAllVehicleDocumentComponent', () => {
  let component: OverAllVehicleDocumentComponent;
  let fixture: ComponentFixture<OverAllVehicleDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverAllVehicleDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverAllVehicleDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
