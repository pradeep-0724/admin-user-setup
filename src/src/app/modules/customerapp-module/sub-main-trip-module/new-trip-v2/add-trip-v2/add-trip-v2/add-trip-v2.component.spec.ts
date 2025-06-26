import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTripV2Component } from './add-trip-v2.component';

describe('AddTripV2Component', () => {
  let component: AddTripV2Component;
  let fixture: ComponentFixture<AddTripV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTripV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTripV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
