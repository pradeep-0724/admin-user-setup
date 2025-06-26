import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonRateCardCraneAwpComponent } from './common-rate-card-crane-awp.component';

describe('CommonRateCardCraneAwpComponent', () => {
  let component: CommonRateCardCraneAwpComponent;
  let fixture: ComponentFixture<CommonRateCardCraneAwpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonRateCardCraneAwpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonRateCardCraneAwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
