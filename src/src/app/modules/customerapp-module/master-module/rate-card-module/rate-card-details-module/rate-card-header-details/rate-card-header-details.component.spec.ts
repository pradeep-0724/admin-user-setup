import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCardHeaderDetailsComponent } from './rate-card-header-details.component';

describe('RateCardHeaderDetailsComponent', () => {
  let component: RateCardHeaderDetailsComponent;
  let fixture: ComponentFixture<RateCardHeaderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateCardHeaderDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateCardHeaderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
