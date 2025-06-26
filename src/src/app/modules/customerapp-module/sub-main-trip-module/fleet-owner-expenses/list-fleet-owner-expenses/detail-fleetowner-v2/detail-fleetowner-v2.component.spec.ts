import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFleetownerV2Component } from './detail-fleetowner-v2.component';

describe('DetailFleetownerV2Component', () => {
  let component: DetailFleetownerV2Component;
  let fixture: ComponentFixture<DetailFleetownerV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailFleetownerV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFleetownerV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
