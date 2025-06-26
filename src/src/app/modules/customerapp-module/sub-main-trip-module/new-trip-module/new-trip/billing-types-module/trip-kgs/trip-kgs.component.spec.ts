import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripKgsComponent } from './trip-kgs.component';

describe('TripKgsComponent', () => {
  let component: TripKgsComponent;
  let fixture: ComponentFixture<TripKgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripKgsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripKgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
