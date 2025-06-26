import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCardDetailsComponent } from './rate-card-details.component';

describe('RateCardDetailsComponent', () => {
  let component: RateCardDetailsComponent;
  let fixture: ComponentFixture<RateCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateCardDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
