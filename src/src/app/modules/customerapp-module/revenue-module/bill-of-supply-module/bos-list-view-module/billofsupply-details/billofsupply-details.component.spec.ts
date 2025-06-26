import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillofsupplyDetailsComponent } from './billofsupply-details.component';

describe('BillofsupplyDetailsComponent', () => {
  let component: BillofsupplyDetailsComponent;
  let fixture: ComponentFixture<BillofsupplyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillofsupplyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillofsupplyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
