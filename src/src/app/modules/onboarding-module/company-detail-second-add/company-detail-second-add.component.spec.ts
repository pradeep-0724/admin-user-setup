import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetailSecondAddComponent } from './company-detail-second-add.component';

describe('CompanyDetailSecondAddComponent', () => {
  let component: CompanyDetailSecondAddComponent;
  let fixture: ComponentFixture<CompanyDetailSecondAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDetailSecondAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailSecondAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
