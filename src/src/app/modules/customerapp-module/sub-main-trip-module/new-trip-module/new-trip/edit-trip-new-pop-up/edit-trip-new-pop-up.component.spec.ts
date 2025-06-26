import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTripNewPopUpComponent } from './edit-trip-new-pop-up.component';

describe('EditTripNewPopUpComponent', () => {
  let component: EditTripNewPopUpComponent;
  let fixture: ComponentFixture<EditTripNewPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTripNewPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTripNewPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
