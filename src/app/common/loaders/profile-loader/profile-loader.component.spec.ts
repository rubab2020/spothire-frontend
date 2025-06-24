import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLoaderComponent } from './profile-loader.component';

describe('ProfileLoaderComponent', () => {
  let component: ProfileLoaderComponent;
  let fixture: ComponentFixture<ProfileLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
