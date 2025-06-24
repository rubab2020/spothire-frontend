import { ErrorHandlerService } from './../../services/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { IndividualService } from '../../services/individual.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { responsiveService } from '../../services/responsive.service';
import * as $ from "jquery";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-individual-qualification',
  templateUrl: './individual-qualification.component.html',
  styleUrls: ['./individual-qualification.component.css']
})
export class IndividualQualificationComponent implements OnInit {
  public qualificationForm: FormGroup;
  selectedDegree=[];
  degreeList:any;
  institutionList:any;
  individualQualification:any;
  public showErrorModal = false;
  countCheck = 0;
  loading = false;
  public isMobile: Boolean; //responsive checker

  constructor(
    private responsiveService: responsiveService,
    private errorHandler:ErrorHandlerService,
    private _fb: FormBuilder,
    private toastr: ToastrService,
    private indService: IndividualService,
    private authService:AuthService) {
      this.getQualifications();
  }

  ngOnInit() {
    this.qualificationForm = this._fb.group({
      qualifications: this._fb.array([this.initqualification()])
    });

    //responsive checker
    this.onResize();
    this.responsiveService.checkWidth();
  }

  //responsive checker
  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  initqualification() {
    return this._fb.group({
        id:'',
        degree: '',
        institution: '',
        result_cgpa: '',
        cgpa_scale: '',
        date: '',
        enrollment_data: false,
    });
  }

  getQualifications(){
    this.loading = true;

    let token_parsed = this.authService.getToken();
    let options = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
    
    this.indService.getQualifications(options).subscribe(response => {
      this.degreeList         = response['degrees'];
      this.institutionList    = response['institutions'];
      if(Object.keys(response['data']).length >0){
        const formControl = <FormArray>this.qualificationForm.controls['qualifications'];
        formControl.controls = [];
        response['data'].forEach((element,index) => {
          formControl.push(this.dataPush(element,index));
          if(element.enrolled){
            this.disableDate(index);
          }
          this.countCheck++;
        });
        this.individualQualification = response;
      }
      this.loading = false;
    },error => {
      this.showErrorModal = this.errorHandler.errorHandleFunction(error);
      this.loading = false;
    });
  }

  dataPush(element,index){
    let date = element.completing_date ? new Date(element.completing_date) : '';
    
    this.selectedDegree[index] = element.degree;

    return this._fb.group({
      id: element.id,
      degree: element.degree,
      institution: element.institution,
      result_cgpa: element.result_cgpa,
      cgpa_scale: element.cgpa_scale,
      date: date,
      enrollment_data:element.enrolled,
    })
  }

  onSubmit(values:any) {
    if(this.loading) return;

    values['qualifications'].forEach(element => {
      if(element.enrollment_data) {
        element.completing_date = null;
      }else{
        if(element.date !== "" && element.date !== null && element.date  !== undefined){
          const date = new Date(element.date);
          element.completing_date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        }else{
          element.completing_date = null;
        }
      }
    });

    let tokenParsed = this.authService.getToken();
    let option = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +tokenParsed})};

    this.indService.postQualifications(values['qualifications'],option).subscribe(response => {
      this.degreeList = response['degrees'];
      if(Object.keys(response['data']).length >0){
          const formControl = <FormArray>this.qualificationForm.controls['qualifications'];
          formControl.controls = [];
          response['data'].forEach((element,index) => {
            formControl.push(this.dataPush(element,index));
        });

        this.individualQualification = response;
      }
    });
  }

  addNewRow() {
    const formControl = <FormArray>this.qualificationForm.controls['qualifications'];
    formControl.push(this.initqualification());
    this.countCheck++;
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  }

  deleteRow(index: number) {
    const formControl = <FormArray>this.qualificationForm.controls['qualifications'];
  
    let value = {
      qualification_id: formControl.value[index].id
    }

    this.selectedDegree.splice((index), 1);
    formControl.removeAt(index);
    this.countCheck--;

    if(value.qualification_id !== undefined && value.qualification_id !== null  && value.qualification_id !== ""){
      let token_parsed = this.authService.getToken();
      let option = {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' +token_parsed})};
      this.indService.postDeleteQualification(value,option).subscribe(response => {
      },
      error => {
        let message = "Failed deleting qualification. Pelase try again";
        this.toastr.error(message, 'Error', {
          closeButton: true
        });
      });
    }
  }


  onChangeEnrolled(event,index){
    const newVal = event.target.checked;
    const completionDate = this.qualificationForm.controls['qualifications']['controls'][index]['controls']['date'];
    if(newVal == true){
      completionDate.disable();
    }else{
      completionDate.enable();
    }
  }

  disableDate(index){
    const completionDate = this.qualificationForm.controls['qualifications']['controls'][index]['controls']['date'];
    completionDate.disable();
  }

  resetDateInput(index){
    const field = this.qualificationForm.controls['qualifications']['controls'][index]['controls']['date'];
    field.setValue('');
  }
}
