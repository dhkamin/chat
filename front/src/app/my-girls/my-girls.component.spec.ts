import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGirlsComponent } from './my-girls.component';

describe('MyGirlsComponent', () => {
  let component: MyGirlsComponent;
  let fixture: ComponentFixture<MyGirlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGirlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGirlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
