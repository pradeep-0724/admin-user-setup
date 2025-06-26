import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesCustomfiledComponent } from './preferences-customfiled.component';

describe('PreferencesCustomfiledComponent', () => {
  let component: PreferencesCustomfiledComponent;
  let fixture: ComponentFixture<PreferencesCustomfiledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferencesCustomfiledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesCustomfiledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
