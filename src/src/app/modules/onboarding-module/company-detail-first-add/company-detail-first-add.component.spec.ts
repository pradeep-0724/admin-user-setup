import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetailFirstAddComponent } from './company-detail-first-add.component';

describe('CompanyDetailFirstAddComponent', () => {
  let component: CompanyDetailFirstAddComponent;
  let fixture: ComponentFixture<CompanyDetailFirstAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDetailFirstAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailFirstAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
