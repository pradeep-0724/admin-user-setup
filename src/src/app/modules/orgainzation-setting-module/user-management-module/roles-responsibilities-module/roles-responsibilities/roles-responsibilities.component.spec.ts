import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesResponsibilitiesComponent } from './roles-responsibilities.component';

describe('RolesResponsibilitiesComponent', () => {
  let component: RolesResponsibilitiesComponent;
  let fixture: ComponentFixture<RolesResponsibilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesResponsibilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesResponsibilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
