import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarTaskComponent } from './calendar-task.component';

describe('CalendarTaskComponent', () => {
  let component: CalendarTaskComponent;
  let fixture: ComponentFixture<CalendarTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
