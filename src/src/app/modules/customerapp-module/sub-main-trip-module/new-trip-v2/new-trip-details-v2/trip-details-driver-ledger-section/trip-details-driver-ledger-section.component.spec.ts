import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsDriverLedgerSectionComponent } from './trip-details-driver-ledger-section.component';

describe('TripDetailsDriverLedgerSectionComponent', () => {
  let component: TripDetailsDriverLedgerSectionComponent;
  let fixture: ComponentFixture<TripDetailsDriverLedgerSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsDriverLedgerSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsDriverLedgerSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
