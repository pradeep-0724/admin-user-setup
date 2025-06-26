import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraneChargesComponent } from './crane-charges.component';

describe('CraneChargesComponent', () => {
  let component: CraneChargesComponent;
  let fixture: ComponentFixture<CraneChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CraneChargesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CraneChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
