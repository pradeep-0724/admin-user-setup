import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBiltySetComponent } from './add-bilty-set.component';

describe('AddBiltySetComponent', () => {
  let component: AddBiltySetComponent;
  let fixture: ComponentFixture<AddBiltySetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBiltySetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBiltySetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
