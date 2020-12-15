import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroitUserComponent } from './droit-user.component';

describe('DroitUserComponent', () => {
  let component: DroitUserComponent;
  let fixture: ComponentFixture<DroitUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroitUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroitUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
