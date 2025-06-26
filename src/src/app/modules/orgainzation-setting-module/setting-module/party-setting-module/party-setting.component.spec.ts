import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySettingComponent } from './party-setting.component';

describe('PartySettingComponent', () => {
  let component: PartySettingComponent;
  let fixture: ComponentFixture<PartySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartySettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
