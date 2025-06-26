import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyVehicleProviderComponent } from './party-vehicle-provider.component';

describe('PartyVehicleProviderComponent', () => {
  let component: PartyVehicleProviderComponent;
  let fixture: ComponentFixture<PartyVehicleProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyVehicleProviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyVehicleProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
