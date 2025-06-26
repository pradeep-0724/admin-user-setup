import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationProfileHeaderV2Component } from './organisation-profile-header-v2.component';

describe('OrganisationProfileHeaderV2Component', () => {
  let component: OrganisationProfileHeaderV2Component;
  let fixture: ComponentFixture<OrganisationProfileHeaderV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationProfileHeaderV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationProfileHeaderV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
