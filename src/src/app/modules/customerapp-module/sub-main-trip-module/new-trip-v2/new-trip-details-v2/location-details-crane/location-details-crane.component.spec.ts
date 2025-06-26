import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDetailsCraneComponent } from './location-details-crane.component';

describe('LocationDetailsCraneComponent', () => {
  let component: LocationDetailsCraneComponent;
  let fixture: ComponentFixture<LocationDetailsCraneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationDetailsCraneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationDetailsCraneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
