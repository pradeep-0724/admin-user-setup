import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTripFreightComponent } from './edit-trip-freight.component';

describe('EditTripFreightComponent', () => {
  let component: EditTripFreightComponent;
  let fixture: ComponentFixture<EditTripFreightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTripFreightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTripFreightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
