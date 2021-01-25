import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppFormService } from 'src/app/app-form-service';
import { AppService } from 'src/app/app.service';
import { IClient } from 'src/app/_interfaces/client-interface';
import { Bug } from 'src/app/_models/bug-model';

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

  constructor(  public modalRef: BsModalRef,private appService: AppService, private toastr: ToastrService,  private appFormService: AppFormService,) { 

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
  }

  getForm() {


    this.bugFormSub = this.appFormService._bugForm$.subscribe((bug) => {
      this.bugForm = bug;
      console.log(this.bugForm)

      if ((this.bug!=undefined||this.bug!=null)) {

        this.bugForm.patchValue(this.bug);

        // Can you a more efficient date library like moment.js. However, for a simple case here, I will use simple javascript date.
        this.bugForm.get('resolveByDate').patchValue(this.formatDate((this.bug.resolveByDate!=null||this.bug.resolveByDate!=undefined)?new Date(this.bug.resolveByDate): new Date()));
        
      }
      
    });
  };


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

      const p = Object.assign({},this.bugForm.value);
     
      console.log(p);
      if (this.bug&&this.bug.bugId!='') {

        this.appService.saveBug(p)
        .subscribe(() =>{ this.onSaveComplete(); this.showSuccess('');},
            (error: any) => {this.errorMessage = <any>error, this.showError();}
        );
        
      } else {

        this.appService.postBug(p)
        .subscribe(() =>{ this.onSaveComplete(); this.showSuccess('New');},
            (error: any) => {this.errorMessage = <any>error, this.showError();}
        );
        
      }

    
    } 
    else {
      return;
    }
    


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

        console.log(score)
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

 
  hasFormvalue(value): boolean {
    if (this.bugForm.get(value)) {
      return this.bugForm.get(value).value;
    }
  }

  controlMessage(control, error): any {return this.validationMessages[control][error];};
  isInvalidDirtyTouched(item): boolean{return (this.f[item].invalid && (this.f[item].dirty || this.f[item].touched))};
  hasTypeError(item, type): boolean{return (this.f[item].errors[type])};

  get isNew(): boolean {return this.bug&&(this.bug.bugId == '' || this.bug.bugId == null);}
  get canSave(): boolean {if(this.bugForm!=null||this.bugForm!=undefined) {return (this.bugForm.dirty && this.bugForm.valid);}}




}
