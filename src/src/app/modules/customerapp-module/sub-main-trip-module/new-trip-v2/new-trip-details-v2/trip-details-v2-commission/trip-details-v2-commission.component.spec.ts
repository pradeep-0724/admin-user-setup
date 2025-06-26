import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsV2CommissionComponent } from './trip-details-v2-commission.component';

describe('TripDetailsV2CommissionComponent', () => {
  let component: TripDetailsV2CommissionComponent;
  let fixture: ComponentFixture<TripDetailsV2CommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDetailsV2CommissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDetailsV2CommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
