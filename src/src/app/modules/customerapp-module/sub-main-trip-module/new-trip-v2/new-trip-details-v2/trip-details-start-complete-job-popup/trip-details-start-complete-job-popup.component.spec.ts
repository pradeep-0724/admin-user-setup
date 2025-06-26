import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsStartCompleteJobPopupComponent } from './trip-details-start-complete-job-popup.component';

describe('TripDetailsStartCompleteJobPopupComponent', () => {
  let component: TripDetailsStartCompleteJobPopupComponent;
  let fixture: ComponentFixture<TripDetailsStartCompleteJobPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsStartCompleteJobPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsStartCompleteJobPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
