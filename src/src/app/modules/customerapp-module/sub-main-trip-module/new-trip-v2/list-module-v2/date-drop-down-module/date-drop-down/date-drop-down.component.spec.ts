import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateDropDownComponent } from './date-drop-down.component';

describe('DateDropDownComponent', () => {
  let component: DateDropDownComponent;
  let fixture: ComponentFixture<DateDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateDropDownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
