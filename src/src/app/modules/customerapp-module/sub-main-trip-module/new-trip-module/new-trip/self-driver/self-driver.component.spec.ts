import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfDriverComponent } from './self-driver.component';

describe('SelfDriverComponent', () => {
  let component: SelfDriverComponent;
  let fixture: ComponentFixture<SelfDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
