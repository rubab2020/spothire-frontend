import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  selector: 'app-second-step-fields',
  templateUrl: './second-step-fields.component.html',
  styleUrls: ['./second-step-fields.component.css']
})
export class SecondStepFieldsComponent implements OnInit {
  public Editor = ClassicEditor;
  private descriptionConfig = {
    toolbar: ["bold", "italic", "bulletedList"],
  };
  private requirementsConfig = {
    toolbar: ["bold", "italic", "bulletedList"],
  };

  @Input() workForm: FormGroup;
  @Input() experiences: any;
  @Input() selectedMinimumExperience: any;
  @Input() qualifications: any;
  @Input() selectedMinimumQualification: any;
  @Input() tags: any;
  @Input() selectedSkills: any;
  @Input() description: any;
  @Input() isFormSubmitted: boolean;

  hasCustomSkillTagTypeError = false;
  hasCustomBenfTagTypeError = false;

  constructor() { }

  ngOnInit() {
  }

  addSkillTagFn = (term) => {
    const maxLength = 15;
      if (term.length <= maxLength) {
        this.hasCustomSkillTagTypeError = false;
        return term;
      }
      else{
        this.hasCustomSkillTagTypeError = true;
        return null;
      }
  }
  
  addBenfTagFn = (term) => {
    const maxLength = 40;
      if (term.length <= maxLength) {
        this.hasCustomBenfTagTypeError = false;
        return term;
      }
      else{
        this.hasCustomBenfTagTypeError = true;
        return null;
      }
  }

}
