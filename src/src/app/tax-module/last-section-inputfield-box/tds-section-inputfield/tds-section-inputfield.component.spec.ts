import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsSectionInputfieldComponent } from './tds-section-inputfield.component';

describe('TdsSectionInputfieldComponent', () => {
  let component: TdsSectionInputfieldComponent;
  let fixture: ComponentFixture<TdsSectionInputfieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdsSectionInputfieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsSectionInputfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
