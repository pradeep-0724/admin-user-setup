import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDriverAllowanceComponent } from './add-driver-allowance.component';

describe('AddDriverAllowanceComponent', () => {
  let component: AddDriverAllowanceComponent;
  let fixture: ComponentFixture<AddDriverAllowanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDriverAllowanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDriverAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
