import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsTransactionSectionComponent } from './trip-details-transaction-section.component';

describe('TripDetailsTransactionSectionComponent', () => {
  let component: TripDetailsTransactionSectionComponent;
  let fixture: ComponentFixture<TripDetailsTransactionSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsTransactionSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsTransactionSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
