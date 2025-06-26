import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripAddToBillComponent } from './trip-add-to-bill.component';

describe('TripAddToBillComponent', () => {
  let component: TripAddToBillComponent;
  let fixture: ComponentFixture<TripAddToBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripAddToBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripAddToBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
