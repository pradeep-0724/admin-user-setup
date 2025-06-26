import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEmployeeOthersComponent } from './details-employee-others.component';

describe('DetailsEmployeeOthersComponent', () => {
  let component: DetailsEmployeeOthersComponent;
  let fixture: ComponentFixture<DetailsEmployeeOthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsEmployeeOthersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsEmployeeOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
