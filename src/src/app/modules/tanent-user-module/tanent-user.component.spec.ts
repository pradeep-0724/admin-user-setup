import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TanentUserComponent } from './tanent-user.component';

describe('TanentUserComponent', () => {
  let component: TanentUserComponent;
  let fixture: ComponentFixture<TanentUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TanentUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TanentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
