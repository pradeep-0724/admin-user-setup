import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankactivityPrefrencesComponent } from './bankactivity-prefrences.component';

describe('BankactivityPrefrencesComponent', () => {
  let component: BankactivityPrefrencesComponent;
  let fixture: ComponentFixture<BankactivityPrefrencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankactivityPrefrencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankactivityPrefrencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
