import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastSectionInputfieldBoxComponent } from './last-section-inputfield-box.component';

describe('LastSectionInputfieldBoxComponent', () => {
  let component: LastSectionInputfieldBoxComponent;
  let fixture: ComponentFixture<LastSectionInputfieldBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastSectionInputfieldBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastSectionInputfieldBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
