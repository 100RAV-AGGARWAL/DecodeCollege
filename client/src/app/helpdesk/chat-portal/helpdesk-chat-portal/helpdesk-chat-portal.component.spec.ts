import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskChatPortalComponent } from './helpdesk-chat-portal.component';

describe('HelpdeskChatPortalComponent', () => {
  let component: HelpdeskChatPortalComponent;
  let fixture: ComponentFixture<HelpdeskChatPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpdeskChatPortalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpdeskChatPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
