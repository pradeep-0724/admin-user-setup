import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsVendorAdvanceComponent } from './details-vendor-advance.component';

describe('DetailsVendorAdvanceComponent', () => {
  let component: DetailsVendorAdvanceComponent;
  let fixture: ComponentFixture<DetailsVendorAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsVendorAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsVendorAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
