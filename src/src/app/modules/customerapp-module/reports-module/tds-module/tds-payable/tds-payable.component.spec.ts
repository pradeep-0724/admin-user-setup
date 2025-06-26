import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsPayableComponent } from './tds-payable.component';

describe('TdsPayableComponent', () => {
  let component: TdsPayableComponent;
  let fixture: ComponentFixture<TdsPayableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdsPayableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
