import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTripDetailsV2Component } from './new-trip-details-v2.component';

describe('NewTripDetailsV2Component', () => {
  let component: NewTripDetailsV2Component;
  let fixture: ComponentFixture<NewTripDetailsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTripDetailsV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTripDetailsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
