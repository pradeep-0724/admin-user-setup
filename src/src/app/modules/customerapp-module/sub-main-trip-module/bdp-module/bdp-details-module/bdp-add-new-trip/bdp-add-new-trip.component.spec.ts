import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BdpAddNewTripComponent } from './bdp-add-new-trip.component';

describe('BdpAddNewTripComponent', () => {
  let component: BdpAddNewTripComponent;
  let fixture: ComponentFixture<BdpAddNewTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BdpAddNewTripComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BdpAddNewTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
