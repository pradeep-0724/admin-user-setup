import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfFuelComponent } from './self-fuel.component';

describe('SelfFuelComponent', () => {
  let component: SelfFuelComponent;
  let fixture: ComponentFixture<SelfFuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfFuelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
