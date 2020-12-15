import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactemeComponent } from './contacteme.component';

describe('ContactemeComponent', () => {
  let component: ContactemeComponent;
  let fixture: ComponentFixture<ContactemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
