import { RegistrationService } from './../services/registration.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  public feedbackForm: FormGroup;
  public showAttchment = false;
  temp_array_new=[];
  public circleSpin = false;

  constructor(private _fb: FormBuilder, private toastr: ToastrService, private service: RegistrationService) { }

  ngOnInit() {
    this.feedbackForm = this._fb.group({
      requestType: ['', Validators.required],
      screenshot: '',
      describe: ['', Validators.required ],
      fullName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/[a-zA-Z-,()]$/) ] ],
      email:['', [Validators.required, Validators.pattern(/[^ @]*@[^ @]*$/) ]],
    });
  }

  submitData(){
    this.feedbackForm.controls['requestType'].markAsTouched()
    this.feedbackForm.controls['describe'].markAsTouched()
    this.feedbackForm.controls['email'].markAsTouched()
    
    if(this.feedbackForm.valid){
      this.circleSpin = true;
      const formModel = this.prepareSave();
      
      this.service.postFeedback(formModel).subscribe(response => {
        this.circleSpin = false;
        
        if(response['success']){
          this.toastr.success('Thank you for your feedback!', '',{
            closeButton: true
          });
        }
      },error => {
        this.circleSpin = false;

        if(error.status == 401 && error.statusText == "Unauthorized"){
        }
        this.toastr.error('Something went wrong!', 'Error', {
          closeButton: true
        });
      });
    }
  }

  showAttachment(){
    this.showAttchment = true;
  }
  
  hideAttachment(){
    this.showAttchment = false;
  }
  
  multiImg(event){
    let temp_array = [];
    let anything = event.target.files;
    
    for(let i=0; i<anything.length; i++){
      temp_array.push(anything[i]);
    }
    this.temp_array_new = temp_array;
  }
  private prepareSave(): any {
    let input = new FormData();

    input.append('requestType', this.feedbackForm.get('requestType').value);
    input.append('describe', this.feedbackForm.get('describe').value);
    input.append('fullName', this.feedbackForm.get('fullName').value);
    input.append('email', this.feedbackForm.get('email').value);
    
    this.temp_array_new.forEach((element,index) => {
      input.append('screenshots[]', element);
    });

    return input;
  }
}
