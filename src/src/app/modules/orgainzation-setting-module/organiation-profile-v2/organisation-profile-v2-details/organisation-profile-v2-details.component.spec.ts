import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationProfileV2DetailsComponent } from './organisation-profile-v2-details.component';

describe('OrganisationProfileV2DetailsComponent', () => {
  let component: OrganisationProfileV2DetailsComponent;
  let fixture: ComponentFixture<OrganisationProfileV2DetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationProfileV2DetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationProfileV2DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
