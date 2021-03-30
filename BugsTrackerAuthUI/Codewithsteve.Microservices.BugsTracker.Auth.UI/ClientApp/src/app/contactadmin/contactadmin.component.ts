import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppFormService } from '../app-form-service';
import { AppService } from '../app.service';
import { Contact } from '../_models/contact-model';

@Component({
  selector: 'app-contactadmin',
  templateUrl: './contactadmin.component.html',
  styleUrls: ['./contactadmin.component.css']
})
export class ContactadminComponent implements OnInit {
  contactForm: FormGroup;
  contact: Contact;
  mode: string;
  contactFormSub: Subscription;

  errorMessage: string;

  private validationMessages: { [key: string]: { [key: string]: string } };
  get f() {if(this.contactForm!=null||this.contactForm!=undefined)  return this.contactForm.controls; }

  constructor(private appService: AppService, private toastr: ToastrService,public route:Router,  private appFormService: AppFormService,) { 

    this.validationMessages = {

    firstname: {
      required: 'First name is required.',
      minlength: 'First name must be at least three characters.',
      maxlength: 'First name cannot exceed 50 characters.'
    },
    lastname: {
      required: 'Last name is required.',
      minlength: 'Last name must be at least three characters.',
      maxlength: 'Last cannot exceed 50 characters.'
    },
    email: {
      required: 'Email is required.',
      pattern: 'Please provide a valid email.',
    },
    message: {
      required: 'Message is required.',
      minlength: 'Message must be at least three characters.',
      maxlength: 'Message cannot exceed 500 characters.'
    },
    subject: {
      required: 'Subject is required.',
      minlength: 'Subject must be at least three characters.',
      maxlength: 'Subject cannot exceed 100 characters.'
    },
     
    };
  }

  ngOnInit() {

    this.getForm();
  }

  getForm() {


    this.contactFormSub = this.appFormService._contactForm$.subscribe((contact) => {
      this.contactForm = contact;
      console.log(this.contactForm)

      if ((this.contact!=undefined||this.contact!=null)) {
        this.contactForm.reset();
        this.contactForm.patchValue(this.contact);
        
      }
      
    });
  };

  sendMessage(){

    if (this.contactForm.dirty && this.contactForm.valid) {

      const p = Object.assign({},this.contactForm.value);
     
      console.log(p);

      this.appService.postContact(p)
        .subscribe(() =>{ this.onSaveComplete(); this.showSuccess('New');},
            (error: any) => {this.errorMessage = <any>error, this.showError();}
        );
    } 
    else {
      return;
    }
    


  }

  ngOnDestroy(): void {
    this.contactFormSub.unsubscribe();
  }
  resetForm(){
    this.contactForm.reset();

  }

  showSuccess(type) {
    this.toastr.success(`${type} Message was succesfully sent.`,'Sent!' ,{
      timeOut: 2000});
  }
  showError() {
    this.toastr.error('Save failed', 'Error!', {
    timeOut: 3000});
  }

  

  onSaveComplete() {
    this.route.navigate(['/']);
  }

  formvalue(value): any {
    if (this.contactForm.get(value)) {
      return this.contactForm.get(value).value;
    }
  }

 
  hasFormvalue(value): boolean {
    if (this.contactForm.get(value)) {
      return this.contactForm.get(value).value;
    }
  }

  controlMessage(control, error): any {return this.validationMessages[control][error];};
  isInvalidDirtyTouched(item): boolean{return (this.f[item].invalid && (this.f[item].dirty || this.f[item].touched))};
  hasTypeError(item, type): boolean{return (this.f[item].errors[type])};

  hasError(item): boolean{return (this.f[item].invalid&&this.f[item].touched)};
  noError(item): boolean{return (this.f[item].valid&&this.f[item].touched)};

  get canSave(): boolean {if(this.contactForm!=null||this.contactForm!=undefined) {return this.contactForm.dirty && this.contactForm.valid;}}



}
