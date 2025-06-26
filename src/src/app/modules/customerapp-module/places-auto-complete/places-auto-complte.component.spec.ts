import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesAutoComplteComponent } from './places-auto-complte.component';

describe('PlacesAutoComplteComponent', () => {
  let component: PlacesAutoComplteComponent;
  let fixture: ComponentFixture<PlacesAutoComplteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacesAutoComplteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacesAutoComplteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
