import { FormControl, Validators } from '@angular/forms';

export class ClientForm {

    clientId = new FormControl('');
    name = new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(100)]);
    description = new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(255)]);

    
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
