import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineBiltyCustomFieldComponent } from './online-bilty-custom-field.component';

describe('OnlineBiltyCustomFieldComponent', () => {
  let component: OnlineBiltyCustomFieldComponent;
  let fixture: ComponentFixture<OnlineBiltyCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineBiltyCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineBiltyCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
