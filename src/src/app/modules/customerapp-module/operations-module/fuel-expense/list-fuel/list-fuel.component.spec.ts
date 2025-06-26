import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFuelComponent } from './list-fuel.component';

describe('ListFuelComponent', () => {
  let component: ListFuelComponent;
  let fixture: ComponentFixture<ListFuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFuelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
