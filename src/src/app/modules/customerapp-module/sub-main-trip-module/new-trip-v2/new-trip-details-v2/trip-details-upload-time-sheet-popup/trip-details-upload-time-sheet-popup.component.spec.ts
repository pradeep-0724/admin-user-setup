import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsUploadTimeSheetPopupComponent } from './trip-details-upload-time-sheet-popup.component';

describe('TripDetailsUploadTimeSheetPopupComponent', () => {
  let component: TripDetailsUploadTimeSheetPopupComponent;
  let fixture: ComponentFixture<TripDetailsUploadTimeSheetPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsUploadTimeSheetPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsUploadTimeSheetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
