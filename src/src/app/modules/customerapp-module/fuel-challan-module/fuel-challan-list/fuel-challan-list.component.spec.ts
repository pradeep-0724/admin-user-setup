import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelChallanListComponent } from './fuel-challan-list.component';

describe('FuelChallanListComponent', () => {
  let component: FuelChallanListComponent;
  let fixture: ComponentFixture<FuelChallanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelChallanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelChallanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
