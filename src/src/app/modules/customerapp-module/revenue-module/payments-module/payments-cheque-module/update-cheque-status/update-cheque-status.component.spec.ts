import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateChequeStatusComponent } from './update-cheque-status.component';

describe('UpdateChequeStatusComponent', () => {
  let component: UpdateChequeStatusComponent;
  let fixture: ComponentFixture<UpdateChequeStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateChequeStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateChequeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
