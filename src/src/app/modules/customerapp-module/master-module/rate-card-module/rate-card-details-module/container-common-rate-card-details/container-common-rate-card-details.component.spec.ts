import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerCommonRateCardDetailsComponent } from './container-common-rate-card-details.component';

describe('ContainerCommonRateCardDetailsComponent', () => {
  let component: ContainerCommonRateCardDetailsComponent;
  let fixture: ComponentFixture<ContainerCommonRateCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerCommonRateCardDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerCommonRateCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
