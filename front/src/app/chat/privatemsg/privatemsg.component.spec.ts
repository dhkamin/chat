import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatemsgComponent } from './privatemsg.component';

describe('PrivatemsgComponent', () => {
  let component: PrivatemsgComponent;
  let fixture: ComponentFixture<PrivatemsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivatemsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivatemsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
