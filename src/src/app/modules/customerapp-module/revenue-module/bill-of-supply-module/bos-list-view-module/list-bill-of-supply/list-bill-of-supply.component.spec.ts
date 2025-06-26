import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBillOfSupplyComponent } from './list-bill-of-supply.component';

describe('ListBillOfSupplyComponent', () => {
  let component: ListBillOfSupplyComponent;
  let fixture: ComponentFixture<ListBillOfSupplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBillOfSupplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBillOfSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
