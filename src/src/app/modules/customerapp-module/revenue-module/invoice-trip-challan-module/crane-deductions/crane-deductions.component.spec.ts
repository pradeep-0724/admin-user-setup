import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraneDeductionsComponent } from './crane-deductions.component';

describe('CraneDeductionsComponent', () => {
  let component: CraneDeductionsComponent;
  let fixture: ComponentFixture<CraneDeductionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CraneDeductionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CraneDeductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
