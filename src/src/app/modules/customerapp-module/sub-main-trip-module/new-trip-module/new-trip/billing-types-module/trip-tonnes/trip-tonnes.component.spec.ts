import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripTonnesComponent } from './trip-tonnes.component';

describe('TripTonnesComponent', () => {
  let component: TripTonnesComponent;
  let fixture: ComponentFixture<TripTonnesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripTonnesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripTonnesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
