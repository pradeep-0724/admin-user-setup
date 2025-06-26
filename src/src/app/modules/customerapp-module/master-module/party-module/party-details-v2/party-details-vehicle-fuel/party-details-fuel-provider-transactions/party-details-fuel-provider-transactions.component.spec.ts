import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsFuelProviderTransactionsComponent } from './party-details-fuel-provider-transactions.component';

describe('PartyDetailsFuelProviderTransactionsComponent', () => {
  let component: PartyDetailsFuelProviderTransactionsComponent;
  let fixture: ComponentFixture<PartyDetailsFuelProviderTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsFuelProviderTransactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsFuelProviderTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
