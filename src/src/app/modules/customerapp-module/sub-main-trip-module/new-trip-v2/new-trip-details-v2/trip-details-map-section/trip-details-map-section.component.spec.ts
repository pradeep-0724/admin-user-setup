import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsMapSectionComponent } from './trip-details-map-section.component';

describe('TripDetailsMapSectionComponent', () => {
  let component: TripDetailsMapSectionComponent;
  let fixture: ComponentFixture<TripDetailsMapSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsMapSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsMapSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
