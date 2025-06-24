import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fourth-step-fields',
  templateUrl: './fourth-step-fields.component.html',
  styleUrls: ['./fourth-step-fields.component.css']
})
export class FourthStepFieldsComponent implements OnInit {
  @Input() workForm: FormGroup;
  @Input() advertDays: any;
  @Input() isFormSubmitted: boolean;
  
  constructor() { }

  ngOnInit() {
  }

  onClickAdvertDuration(item: any) {
    this.workForm.get('advert_duration').setValue(item.value);
  }

}
