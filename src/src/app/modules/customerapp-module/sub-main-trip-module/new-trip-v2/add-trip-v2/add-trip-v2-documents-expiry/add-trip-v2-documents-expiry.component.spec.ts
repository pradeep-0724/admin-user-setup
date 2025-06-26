import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTripV2DocumentsExpiryComponent } from './add-trip-v2-documents-expiry.component';

describe('AddTripV2DocumentsExpiryComponent', () => {
  let component: AddTripV2DocumentsExpiryComponent;
  let fixture: ComponentFixture<AddTripV2DocumentsExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTripV2DocumentsExpiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTripV2DocumentsExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
