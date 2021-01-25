import { FormControl, Validators } from '@angular/forms';

export class BugForm {


    bugId = new FormControl('');
    name = new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(100)]);
    status = new FormControl('', Validators.required);
    projectId= new FormControl('');
    clientId = new FormControl('', Validators.required);
    resolveByDate = new FormControl('', Validators.required);

    description = new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(255)]);
    priority = new FormControl('', Validators.required);
    impact = new FormControl('', Validators.required);
    severitylevel = new FormControl('', Validators.required);
    severity = new FormControl('');
    notes = new FormControl('');
    resolvedBy = new FormControl('');
    signedoffBy = new FormControl('');

    
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
