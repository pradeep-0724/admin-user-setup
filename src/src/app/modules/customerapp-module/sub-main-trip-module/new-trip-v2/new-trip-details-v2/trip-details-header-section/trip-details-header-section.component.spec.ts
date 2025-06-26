import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsHeaderSectionComponent } from './trip-details-header-section.component';

describe('TripDetailsHeaderSectionComponent', () => {
  let component: TripDetailsHeaderSectionComponent;
  let fixture: ComponentFixture<TripDetailsHeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsHeaderSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
