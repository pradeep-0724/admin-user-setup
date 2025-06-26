import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsPartyTransactionsComponent } from './party-details-party-transactions.component';

describe('PartyDetailsPartyTransactionsComponent', () => {
  let component: PartyDetailsPartyTransactionsComponent;
  let fixture: ComponentFixture<PartyDetailsPartyTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsPartyTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsPartyTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
