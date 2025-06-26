import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillofsupplysettingsComponent } from './billofsupplysettings.component';

describe('BillofsupplysettingsComponent', () => {
  let component: BillofsupplysettingsComponent;
  let fixture: ComponentFixture<BillofsupplysettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillofsupplysettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillofsupplysettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
