import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAddCompanyComponent } from './new-add-company.component';

describe('NewAddCompanyComponent', () => {
  let component: NewAddCompanyComponent;
  let fixture: ComponentFixture<NewAddCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAddCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAddCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
