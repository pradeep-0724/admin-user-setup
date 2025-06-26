import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsMakeDeliveryNotePopupComponent } from './trip-details-make-delivery-note-popup.component';

describe('TripDetailsMakeDeliveryNotePopupComponent', () => {
  let component: TripDetailsMakeDeliveryNotePopupComponent;
  let fixture: ComponentFixture<TripDetailsMakeDeliveryNotePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsMakeDeliveryNotePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsMakeDeliveryNotePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
