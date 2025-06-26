import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyVehicleProviderHeaderComponent } from './party-vehicle-provider-header.component';

describe('PartyVehicleProviderHeaderComponent', () => {
  let component: PartyVehicleProviderHeaderComponent;
  let fixture: ComponentFixture<PartyVehicleProviderHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyVehicleProviderHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyVehicleProviderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
