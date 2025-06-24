import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualSettingsComponent } from './individual-settings.component';

describe('IndividualSettingsComponent', () => {
  let component: IndividualSettingsComponent;
  let fixture: ComponentFixture<IndividualSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
