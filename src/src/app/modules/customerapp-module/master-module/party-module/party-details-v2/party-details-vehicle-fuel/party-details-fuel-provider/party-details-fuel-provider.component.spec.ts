import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsFuelProviderComponent } from './party-details-fuel-provider.component';

describe('PartyDetailsFuelProviderComponent', () => {
  let component: PartyDetailsFuelProviderComponent;
  let fixture: ComponentFixture<PartyDetailsFuelProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsFuelProviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsFuelProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
