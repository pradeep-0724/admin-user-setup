import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTripPopupAddComponent } from './new-trip-popup-add.component';

describe('NewTripPopupAddComponent', () => {
  let component: NewTripPopupAddComponent;
  let fixture: ComponentFixture<NewTripPopupAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTripPopupAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTripPopupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
