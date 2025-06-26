import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsDeliveryNoteSectionComponent } from './trip-details-delivery-note-section.component';

describe('TripDetailsDeliveryNoteSectionComponent', () => {
  let component: TripDetailsDeliveryNoteSectionComponent;
  let fixture: ComponentFixture<TripDetailsDeliveryNoteSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsDeliveryNoteSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsDeliveryNoteSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
