import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserconnectedComponent } from './userconnected.component';

describe('UserconnectedComponent', () => {
  let component: UserconnectedComponent;
  let fixture: ComponentFixture<UserconnectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserconnectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserconnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
