import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsTimeSheetSectionComponent } from './trip-details-time-sheet-section.component';

describe('TripDetailsTimeSheetSectionComponent', () => {
  let component: TripDetailsTimeSheetSectionComponent;
  let fixture: ComponentFixture<TripDetailsTimeSheetSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsTimeSheetSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsTimeSheetSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
