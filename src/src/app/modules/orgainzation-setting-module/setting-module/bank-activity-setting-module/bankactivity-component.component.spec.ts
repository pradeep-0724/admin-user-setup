import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankactivityComponentComponent } from './bankactivity-component.component';

describe('BankactivityComponentComponent', () => {
  let component: BankactivityComponentComponent;
  let fixture: ComponentFixture<BankactivityComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankactivityComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankactivityComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
