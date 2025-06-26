import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonRateCardContainerComponent } from './common-rate-card-container.component';

describe('CommonRateCardContainerComponent', () => {
  let component: CommonRateCardContainerComponent;
  let fixture: ComponentFixture<CommonRateCardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonRateCardContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonRateCardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
