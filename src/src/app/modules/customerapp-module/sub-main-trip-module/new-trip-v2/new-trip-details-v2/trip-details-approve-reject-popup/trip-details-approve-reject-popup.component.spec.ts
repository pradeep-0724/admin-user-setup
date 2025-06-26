import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsApproveRejectPopupComponent } from './trip-details-approve-reject-popup.component';

describe('TripDetailsApproveRejectPopupComponent', () => {
  let component: TripDetailsApproveRejectPopupComponent;
  let fixture: ComponentFixture<TripDetailsApproveRejectPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsApproveRejectPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsApproveRejectPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
