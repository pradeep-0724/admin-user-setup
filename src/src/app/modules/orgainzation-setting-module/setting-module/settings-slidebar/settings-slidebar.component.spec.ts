import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSlidebarComponent } from './settings-slidebar.component';

describe('SettingsSlidebarComponent', () => {
  let component: SettingsSlidebarComponent;
  let fixture: ComponentFixture<SettingsSlidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsSlidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSlidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
