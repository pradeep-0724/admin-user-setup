import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsSummarySectionComponent } from './trip-details-summary-section.component';

describe('TripDetailsSummarySectionComponent', () => {
  let component: TripDetailsSummarySectionComponent;
  let fixture: ComponentFixture<TripDetailsSummarySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsSummarySectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsSummarySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
