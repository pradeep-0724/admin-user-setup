import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitLocationsSideBarComponent } from './permit-locations-side-bar.component';

describe('PermitLocationsSideBarComponent', () => {
  let component: PermitLocationsSideBarComponent;
  let fixture: ComponentFixture<PermitLocationsSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermitLocationsSideBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermitLocationsSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
