import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-first-step-fields',
  templateUrl: './first-step-fields.component.html',
  styleUrls: ['./first-step-fields.component.css']
})
export class FirstStepFieldsComponent implements OnInit {
  @Input() workForm: FormGroup;
  @Input() employmentTypes: any;
  @Input() selectedEmploymentType: any;
  @Input() departments: any;
  @Input() selectedDepartment: any;
  @Input() salaryTypes: any;
  @Input() selectedSalaryType: any;
  @Input() locations: any;
  @Input() selectedLocation: any;
  @Input() isFormSubmitted: boolean;

  constructor() { }

  ngOnInit() {
  }

  onChangeNegotiable(event){
    const newVal = event.target.checked;
    const salaryFrom = this.workForm.controls['salary_from'];
    const salaryTo = this.workForm.controls['salary_to'];
    const salaryType = this.workForm.controls['salary_type'];
    if(newVal == true){
      salaryFrom.setValue('');
      salaryFrom.disable();
      salaryTo.setValue('');
      salaryTo.disable();
      salaryType.setValue('');
      salaryType.disable();
    }else{
      salaryFrom.enable();
      salaryTo.enable();
      salaryType.enable();
    }
  }
}
