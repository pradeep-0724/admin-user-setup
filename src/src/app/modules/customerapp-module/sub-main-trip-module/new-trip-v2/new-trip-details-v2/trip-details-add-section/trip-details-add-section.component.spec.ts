import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsAddSectionComponent } from './trip-details-add-section.component';

describe('TripDetailsAddSectionComponent', () => {
  let component: TripDetailsAddSectionComponent;
  let fixture: ComponentFixture<TripDetailsAddSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsAddSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsAddSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
