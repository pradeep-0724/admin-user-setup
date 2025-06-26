import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsPartyInfoComponent } from './party-details-party-info.component';

describe('PartyDetailsPartyInfoComponent', () => {
  let component: PartyDetailsPartyInfoComponent;
  let fixture: ComponentFixture<PartyDetailsPartyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsPartyInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsPartyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
