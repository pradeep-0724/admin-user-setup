import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsTripDocumentsSectionComponent } from './trip-details-trip-documents-section.component';

describe('TripDetailsTripDocumentsSectionComponent', () => {
  let component: TripDetailsTripDocumentsSectionComponent;
  let fixture: ComponentFixture<TripDetailsTripDocumentsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsTripDocumentsSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsTripDocumentsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
