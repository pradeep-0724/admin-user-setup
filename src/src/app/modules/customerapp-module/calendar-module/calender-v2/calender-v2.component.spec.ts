import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderV2Component } from './calender-v2.component';

describe('CalenderV2Component', () => {
  let component: CalenderV2Component;
  let fixture: ComponentFixture<CalenderV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalenderV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
