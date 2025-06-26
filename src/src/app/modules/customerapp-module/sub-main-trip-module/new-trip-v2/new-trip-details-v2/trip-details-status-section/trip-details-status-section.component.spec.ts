import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsStatusSectionComponent } from './trip-details-status-section.component';

describe('TripDetailsStatusSectionComponent', () => {
  let component: TripDetailsStatusSectionComponent;
  let fixture: ComponentFixture<TripDetailsStatusSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsStatusSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsStatusSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
