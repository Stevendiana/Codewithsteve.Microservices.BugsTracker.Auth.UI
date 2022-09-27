import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppFormService } from 'src/app/app-form-service';
import { AppService } from 'src/app/app.service';
import { IClient } from 'src/app/_interfaces/client-interface';
import { Bug } from 'src/app/_models/bug-model';

import * as data from '../../data/data';
import { IBug } from '../../_interfaces/bug-interface';

@Component({
  selector: 'app-edit-bug',
  templateUrl: './edit-bug.component.html',
  styleUrls: ['./edit-bug.component.css']
})
export class EditBugComponent implements OnInit {

  bugForm: FormGroup;
  bug: Bug;
  mode: string;
  bugFormSub: Subscription;
  clients: IClient[]=[];
  bugs: IBug[]=[];
  loggedIn = false;

  scores = [ 
    { name: 'Low', score: '1'},
    { name: 'Medium', score: '3'},
    { name: 'High', score: '5'},
  ];

  livestatus = ['Open', 'Closed'];

  statuses = [
      { name: 'Red', status: 'Red'},
      { name: 'Amber', status: 'Amber'},
      { name: 'Green', status: 'Green'},
    
  ];

  statusList = ["New", "In-Progress","Resolved","On-Hold"];

  errorMessage: string;

  private validationMessages: { [key: string]: { [key: string]: string } };
  get f() {if(this.bugForm!=null||this.bugForm!=undefined)  return this.bugForm.controls; }

  constructor(  public modalRef: BsModalRef,public route:Router,private appService: AppService, private toastr: ToastrService,private authService: MsalService, private appFormService: AppFormService,) { 

    this.validationMessages = {
      description: {
        required: 'Description is required.',
        minlength: 'Description must be at least three characters.',
        maxlength: 'Description cannot exceed 500 characters.'
      },
      name: {
        required: 'Title is required.',
        minlength: 'Title must be at least three characters.',
        maxlength: 'Title cannot exceed 30 characters.'
      },
      impact: {
        required: 'Impact is required.',
      },
      priority: {
        required: 'Priority is required.',
      },
      notes: {
        required: 'Mitigation plan is required.',
        minlength: 'Mitigation plan must be at least three characters.',
        maxlength: 'Mitigation plan cannot exceed 50 characters.'
      },
      owner: {
        required: 'Owner is required.',
      },
      status: {
        required: 'Status is required.',
      },
      clientId: {
        required: 'Client Application is required.',
      },
      resolveByDate: {
        required: 'Resolution Due Date is required.',
      },

    };
  }

  ngOnInit() {
    this.getForm();
    this.checkAccount();
  }

  gotoContactme() {
    this.modalRef.hide();
    this.route.navigate(['/contact-admin']);
  }


  getForm() {

    this.bugFormSub = this.appFormService._bugForm$.subscribe((bug) => {

      this.bugForm = bug;
      // console.log(this.bugForm)

      if ((this.bug!=undefined||this.bug!=null)) {
        this.bugForm.reset();
        this.bugForm.patchValue(this.bug);

        // Can use a more efficient date library like moment.js. However, for a simple case here, I will use simple javascript date.
        this.bugForm.get('resolveByDate').patchValue(this.formatDate((this.bug.resolveByDate!=null||this.bug.resolveByDate!=undefined)?new Date(this.bug.resolveByDate): new Date()));
        
      }
      
    });
  };

  ngOnDestroy(): void {
    this.bugFormSub.unsubscribe();
  }


  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  saveBug(){


    if (this.bugForm.dirty && this.bugForm.valid) {

      // const p = Object.assign({},this.bugForm.value);
     
      // console.log(p);
      // if (this.bug&&this.bug.bugId!='') {

      //   this.appService.saveBug(p)
      //   .subscribe(() =>{ this.onSaveComplete(); this.showSuccess('');},
      //       (error: any) => {this.errorMessage = <any>error, this.showError();}
      //   );
        
      // } else {

      //   this.appService.postBug(p)
      //   .subscribe(() =>{ this.onSaveComplete(); this.showSuccess('New');},
      //       (error: any) => {this.errorMessage = <any>error, this.showError();}
      //   );
        
      // }

      //frontend save
      this.bugs=data.bugs;
      console.log(this.bugForm.value)
      if (this.bug&&this.bug.bugId!='') {
        const p = Object.assign({},this.bugForm.value);
        let bug = this.bugs.find(x=>x.bugId==this.bug.bugId);
        // var filtered = this.bugs.filter(function(el) { return el.bugCode != bug.bugCode; }); 
        for( var i = 0; i < this.bugs.length; i++){ 
                                   
          if ( this.bugs[i].bugCode === bug.bugCode) { 
            this.bugs.splice(i, 1); 
              i--; 
          }
        }
        this.bugs.push(p);
        this.showSuccess('');
        this.modalRef.hide();
        this.getBugs();
          
      } else {
        
        const p = Object.assign({},this.bugForm.value);
        this.bugs.push(p);
        this.showSuccess('New');
        this.modalRef.hide();
        this.getBugs();
      }
    } 
    else {
      return;
    }

  }

  getBugs() {
    this.getClients();
    this.bugs=data.bugs;
    this.bugs.map(x=>{
      let rand = (Math.random().toString(36).substr(2, 8)).toUpperCase();
      x.clientName = x.bugId==''? this.clients.find(y=>y.clientId==x.clientId).name : x.clientName;
      x.bugCode = x.bugId==''? `BUG-${rand}`: x.bugCode;
      x.dateCreated = x.bugId==''? new Date().toLocaleDateString(): x.dateCreated;
    });
  }

  getClients() {

    this.clients=data.clients;
  }

 


  showSuccess(type) {
    this.toastr.success(`${type} Bug was succesfully saved to the database.`,'Saved!' ,{
      timeOut: 2000});
  }
  showError() {
    this.toastr.error('Save failed', 'Error!', {
    timeOut: 3000});
  }

  


  calculateSeverity() {

    if (this.bugForm) {

      const priority = this.bugForm.get('priority');
      const impact = this.bugForm.get('impact');
      const severity = this.bugForm.get('severity');
      const level = this.bugForm.get('severitylevel');

      if ((priority.value!=null||priority.value!=undefined||priority.value!='')&&(impact.value!=null||impact.value!=undefined||impact.value!='')) {
        
        const score= Number(priority.value)*Number(impact.value);
       
        severity.setValue(score);

        const severityLevel = this.setSeverityLevel();
        level.setValue(severityLevel);

        return score;
      }
      
    }
  }

  colourCode() {

    const severity = this.bugForm.get('severity');
    if (severity.value>0&&severity.value<=5) {
      return 'green';
    }
    if (severity.value==9) {
      return 'amber';
    }
    if (severity.value>9) {
      return 'red';
    }


  }

  setSeverityLevel() {

    const severity = Number(this.bugForm.get('severity').value);
    if (severity>0&&severity<=5) {
      return 'Low';
    }
    if (severity==9) {
      return 'Medium';
    }
    if (severity>9) {
      return 'High';
    }


  }


  onSaveComplete() {
    this.appService.getBugs();
    this.modalRef.hide();
  }

  formvalue(value): any {
    if (this.bugForm.get(value)) {
      return this.bugForm.get(value).value;
    }
  }

  checkAccount() {
    this.loggedIn = !!this.authService.getAccount();
  }

 
  hasFormvalue(value): boolean {
    if (this.bugForm.get(value)) {
      return this.bugForm.get(value).value;
    }
  }

  checkStatus(status) {

    if (status!==null||status!==undefined) {
      if (status==='New') {
        return 'rgba(229,229,229,1)';
      }
      if (status==='In-Progress') {
        return 'rgba(153,204,153, 1)';
      }
      if (status==='Resolved') {
        return 'rgba(0, 124, 0, 1)';
      }
      if (status==='On-Hold') {
        return 'rgba(255,174,25,1)';
      }
        
    }

  }

  controlMessage(control, error): any {return this.validationMessages[control][error];};
  isInvalidDirtyTouched(item): boolean{return (this.f[item].invalid && (this.f[item].dirty || this.f[item].touched))};
  hasTypeError(item, type): boolean{return (this.f[item].errors[type])};
  hasError(item): boolean{return (this.f[item].invalid&&this.f[item].touched)};
  noError(item): boolean{return (this.f[item].valid&&this.f[item].touched)};


  get isNew(): boolean {return this.bug&&(this.bug.bugId == '' || this.bug.bugId == null);}
  get canSave(): boolean {if(this.bugForm!=null||this.bugForm!=undefined) {return (this.bugForm.dirty && this.bugForm.valid);}}




}
