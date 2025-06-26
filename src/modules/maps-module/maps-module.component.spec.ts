import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsModuleComponent } from './maps-module.component';

describe('MapsModuleComponent', () => {
  let component: MapsModuleComponent;
  let fixture: ComponentFixture<MapsModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapsModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
