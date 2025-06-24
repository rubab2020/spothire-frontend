import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  public forgetPwForm: FormGroup;
  circleSpin = false;


  constructor(public service:AuthService, private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.forgetPwForm = this._fb.group({
      password:['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])/) ]],
      rePassword:['', [Validators.required, Validators.minLength(6) ]]
    });
  }

}
