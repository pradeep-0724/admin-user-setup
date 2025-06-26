import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInputFieldBoxComponent } from './header-input-field-box.component';

describe('HeaderInputFieldBoxComponent', () => {
  let component: HeaderInputFieldBoxComponent;
  let fixture: ComponentFixture<HeaderInputFieldBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderInputFieldBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderInputFieldBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
