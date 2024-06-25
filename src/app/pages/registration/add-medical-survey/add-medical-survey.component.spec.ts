import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicalSurveyComponent } from './add-medical-survey.component';

describe('AddMedicalSurveyComponent', () => {
  let component: AddMedicalSurveyComponent;
  let fixture: ComponentFixture<AddMedicalSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicalSurveyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMedicalSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
