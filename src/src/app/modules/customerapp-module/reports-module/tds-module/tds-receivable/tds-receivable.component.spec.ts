import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsReceivableComponent } from './tds-receivable.component';

describe('TdsReceivableComponent', () => {
  let component: TdsReceivableComponent;
  let fixture: ComponentFixture<TdsReceivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdsReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
