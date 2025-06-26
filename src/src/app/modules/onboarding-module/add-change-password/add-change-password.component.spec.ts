import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChangePasswordComponent } from './add-change-password.component';

describe('AddChangePasswordComponent', () => {
  let component: AddChangePasswordComponent;
  let fixture: ComponentFixture<AddChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
