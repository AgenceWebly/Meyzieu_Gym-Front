import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersByUserComponent } from './members-by-user.component';

describe('MembersByUserComponent', () => {
  let component: MembersByUserComponent;
  let fixture: ComponentFixture<MembersByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersByUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembersByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
