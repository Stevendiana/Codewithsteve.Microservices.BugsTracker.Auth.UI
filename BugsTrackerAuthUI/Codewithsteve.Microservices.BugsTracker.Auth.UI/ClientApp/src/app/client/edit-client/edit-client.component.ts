import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppFormService } from 'src/app/app-form-service';
import { AppService } from 'src/app/app.service';
import { Client } from 'src/app/_models/client-model ';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {
  clientForm: FormGroup;
  client: Client;
  mode: string;
  clientFormSub: Subscription;

  errorMessage: string;

  private validationMessages: { [key: string]: { [key: string]: string } };
  get f() {if(this.clientForm!=null||this.clientForm!=undefined)  return this.clientForm.controls; }

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
     
    };
  }

  ngOnInit() {

    this.getForm();
  }

  getForm() {


    this.clientFormSub = this.appFormService._clientForm$.subscribe((client) => {
      this.clientForm = client;
      console.log(this.clientForm)

      if ((this.client!=undefined||this.client!=null)) {

        this.clientForm.patchValue(this.client);
       
        
      }
      
    });
  };

  saveClient(){


    if (this.clientForm.dirty && this.clientForm.valid) {

      const p = Object.assign({},this.clientForm.value);
     
      console.log(p);
      if (this.client&&(this.client.clientId!=''&&this.client.clientId!=null)) {

        this.appService.saveClient(p)
        .subscribe(() =>{ this.onSaveComplete(); this.showSuccess('');},
            (error: any) => {this.errorMessage = <any>error, this.showError();}
        );
        
      } else {

        this.appService.postClient(p)
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
    this.toastr.success(`${type} Client was succesfully saved to the database.`,'Saved!' ,{
      timeOut: 2000});
  }
  showError() {
    this.toastr.error('Save failed', 'Error!', {
    timeOut: 3000});
  }

  

  onSaveComplete() {
    this.appService.getClients();
    this.modalRef.hide();
  }

  formvalue(value): any {
    if (this.clientForm.get(value)) {
      return this.clientForm.get(value).value;
    }
  }

 
  hasFormvalue(value): boolean {
    if (this.clientForm.get(value)) {
      return this.clientForm.get(value).value;
    }
  }

  controlMessage(control, error): any {return this.validationMessages[control][error];};
  isInvalidDirtyTouched(item): boolean{return (this.f[item].invalid && (this.f[item].dirty || this.f[item].touched))};
  hasTypeError(item, type): boolean{return (this.f[item].errors[type])};

  get isNew(): boolean {return this.client&&(this.client.clientId == '' || this.client.clientId == null);}
  get canSave(): boolean {if(this.clientForm!=null||this.clientForm!=undefined) {return this.clientForm.dirty && this.clientForm.valid;}}



}
