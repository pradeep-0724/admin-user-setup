import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualInventoryReportsComponent } from './individual-inventory-reports.component';

describe('IndividualInventoryReportsComponent', () => {
  let component: IndividualInventoryReportsComponent;
  let fixture: ComponentFixture<IndividualInventoryReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualInventoryReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualInventoryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
