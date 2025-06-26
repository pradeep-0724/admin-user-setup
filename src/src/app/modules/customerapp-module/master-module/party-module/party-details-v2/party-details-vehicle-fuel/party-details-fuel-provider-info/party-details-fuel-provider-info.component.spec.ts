import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyDetailsFuelProviderInfoComponent } from './party-details-fuel-provider-info.component';

describe('PartyDetailsFuelProviderInfoComponent', () => {
  let component: PartyDetailsFuelProviderInfoComponent;
  let fixture: ComponentFixture<PartyDetailsFuelProviderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyDetailsFuelProviderInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyDetailsFuelProviderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
