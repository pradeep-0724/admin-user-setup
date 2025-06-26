import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDocumentSectionV2Component } from './vehicle-document-section-v2.component';

describe('VehicleDocumentSectionV2Component', () => {
  let component: VehicleDocumentSectionV2Component;
  let fixture: ComponentFixture<VehicleDocumentSectionV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDocumentSectionV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDocumentSectionV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
