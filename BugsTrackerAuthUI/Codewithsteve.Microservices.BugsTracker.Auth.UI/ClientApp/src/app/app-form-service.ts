import { Injectable, OnInit, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs'
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms'
import { BugForm } from './_forms/bug-form ';
import { Bug } from './_models/bug-model';
import { ClientForm } from './_forms/client-form ';
import { Client } from './_models/client-model ';
import { Contact } from './_models/contact-model';
import { ContactForm } from './_forms/contact-form';

@Injectable({
    providedIn: 'root'
})
export class AppFormService {

  // Bug
  _bugForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.fb.group(new BugForm(new Bug()))); //
  _bugForm$: Observable<FormGroup> = this._bugForm.asObservable();

  // Client
  _clientForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.fb.group(new ClientForm(new Client()))); //
  _clientForm$: Observable<FormGroup> = this._clientForm.asObservable();

  // Contact us
  _contactForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.fb.group(new ContactForm(new Contact()))); //
  _contactForm$: Observable<FormGroup> = this._contactForm.asObservable();

 
  constructor(private fb: FormBuilder) {
    
  
  }

  



}
