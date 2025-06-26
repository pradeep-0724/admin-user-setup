import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrefixComponent } from './add-prefix.component';

describe('AddPrefixComponent', () => {
  let component: AddPrefixComponent;
  let fixture: ComponentFixture<AddPrefixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPrefixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPrefixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
