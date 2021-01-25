export class Bug {
  
    bugId: string='';
    bugCode: string='';
    dateCreated: string='';
    resolveByDate: string='';
    name: string='';
    userCreated: string='';
    status: string='';

    projectId: string='';
    clientId: string='';
   
    projectName: string='';
    clientName: string='';

    description: string='';
    priority: string='';
    impact: string='';
    severity: number=0;
    severitylevel: string='';
    notes: string='';
    createdBy: string='';
    lastModifiedBy: string='';
    resolvedBy: string='';
    signedoffBy: string='';

    client:  any;
    project: any;


    
  }
  