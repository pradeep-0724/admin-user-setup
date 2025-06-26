import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsFuelProviderHeaderComponent } from './party-details-fuel-provider-header.component';

describe('PartyDetailsFuelProviderHeaderComponent', () => {
  let component: PartyDetailsFuelProviderHeaderComponent;
  let fixture: ComponentFixture<PartyDetailsFuelProviderHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsFuelProviderHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsFuelProviderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
