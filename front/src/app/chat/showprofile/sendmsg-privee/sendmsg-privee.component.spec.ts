import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendmsgPriveeComponent } from './sendmsg-privee.component';

describe('SendmsgPriveeComponent', () => {
  let component: SendmsgPriveeComponent;
  let fixture: ComponentFixture<SendmsgPriveeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendmsgPriveeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendmsgPriveeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
