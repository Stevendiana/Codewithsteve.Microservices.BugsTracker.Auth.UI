import { FormControl, Validators } from '@angular/forms';

const emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$' 

export class ContactForm {


    firstname = new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(50)]);
    lastname = new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(50)]);
    email = new FormControl('', [Validators.required, Validators.pattern(emailRegex)]);
    subject = new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(100)]);

    message = new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(500)]);
    
    constructor(object?: any) {
        if (object) {
            Object.keys(this).forEach(key => {
                if (object.hasOwnProperty(key)) {
                    this[key].setValue(object[key]);
                }
            });
        }
    }
  
  
}
