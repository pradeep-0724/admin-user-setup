import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTacComponent } from './add-tac.component';

describe('AddPrefixComponent', () => {
  let component: AddTacComponent;
  let fixture: ComponentFixture<AddTacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
