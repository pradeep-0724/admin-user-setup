import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmployeeOthersComponent } from './list-employee-others.component';

describe('ListEmployeeOthersComponent', () => {
  let component: ListEmployeeOthersComponent;
  let fixture: ComponentFixture<ListEmployeeOthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeOthersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
