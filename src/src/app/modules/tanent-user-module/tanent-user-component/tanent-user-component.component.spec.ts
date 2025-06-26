import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TanentUserComponentComponent } from './tanent-user-component.component';

describe('TanentUserComponentComponent', () => {
  let component: TanentUserComponentComponent;
  let fixture: ComponentFixture<TanentUserComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TanentUserComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TanentUserComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
