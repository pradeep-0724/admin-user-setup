import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsProfitLossSectionComponent } from './trip-details-profit-loss-section.component';

describe('TripDetailsProfitLossSectionComponent', () => {
  let component: TripDetailsProfitLossSectionComponent;
  let fixture: ComponentFixture<TripDetailsProfitLossSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsProfitLossSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsProfitLossSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
