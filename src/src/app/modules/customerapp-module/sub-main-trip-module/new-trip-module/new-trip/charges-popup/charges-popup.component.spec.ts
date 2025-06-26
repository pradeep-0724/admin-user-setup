import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargesPopupComponent } from './charges-popup.component';

describe('ChargesPopupComponent', () => {
  let component: ChargesPopupComponent;
  let fixture: ComponentFixture<ChargesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
