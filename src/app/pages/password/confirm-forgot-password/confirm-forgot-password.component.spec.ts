import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmForgotPasswordComponent } from './confirm-forgot-password.component';

describe('ConfirmForgotPasswordComponent', () => {
  let component: ConfirmForgotPasswordComponent;
  let fixture: ComponentFixture<ConfirmForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmForgotPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
