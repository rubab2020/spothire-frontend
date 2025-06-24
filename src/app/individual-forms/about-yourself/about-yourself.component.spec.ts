import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutYourselfComponent } from './about-yourself.component';

describe('AboutYourselfComponent', () => {
  let component: AboutYourselfComponent;
  let fixture: ComponentFixture<AboutYourselfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutYourselfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutYourselfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
