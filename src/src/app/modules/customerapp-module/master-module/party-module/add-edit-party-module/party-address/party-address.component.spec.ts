import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyAddressComponent } from './party-address.component';

describe('PartyAddressComponent', () => {
  let component: PartyAddressComponent;
  let fixture: ComponentFixture<PartyAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
