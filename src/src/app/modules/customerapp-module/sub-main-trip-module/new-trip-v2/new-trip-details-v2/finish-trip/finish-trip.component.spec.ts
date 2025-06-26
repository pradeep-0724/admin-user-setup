import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishTripComponent } from './finish-trip.component';

describe('FinishTripComponent', () => {
  let component: FinishTripComponent;
  let fixture: ComponentFixture<FinishTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishTripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
