import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsFuelProviderSummaryComponent } from './party-details-fuel-provider-summary.component';

describe('PartyDetailsFuelProviderSummaryComponent', () => {
  let component: PartyDetailsFuelProviderSummaryComponent;
  let fixture: ComponentFixture<PartyDetailsFuelProviderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsFuelProviderSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsFuelProviderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
