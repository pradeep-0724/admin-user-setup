import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailPeriodWarningComponent } from './trail-period-warning.component';

describe('TrailPeriodWarningComponent', () => {
  let component: TrailPeriodWarningComponent;
  let fixture: ComponentFixture<TrailPeriodWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrailPeriodWarningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailPeriodWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
