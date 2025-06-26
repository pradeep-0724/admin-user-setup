import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDestinationDetailsComponent } from './trip-destination-details.component';

describe('TripDestinationDetailsComponent', () => {
  let component: TripDestinationDetailsComponent;
  let fixture: ComponentFixture<TripDestinationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDestinationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDestinationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
