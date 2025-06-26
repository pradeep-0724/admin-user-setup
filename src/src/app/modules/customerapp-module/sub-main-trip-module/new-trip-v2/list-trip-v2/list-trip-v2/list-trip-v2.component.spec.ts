import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTripV2Component } from './list-trip-v2.component';

describe('ListTripV2Component', () => {
  let component: ListTripV2Component;
  let fixture: ComponentFixture<ListTripV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTripV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTripV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
