export interface IBug {

    bugId: string;
    bugCode: string;
    dateCreated: string;
    resolveByDate: string;
    name: string;
    userCreated: string;
    status: string;

    projectId: string;
    clientId: string;
   
    description: string;
    priority: string;
    impact: string;
    severity: number;
    severitylevel: string;
    notes: string;
    createdBy: string;
    lastModifiedBy: string;
    resolvedBy: string;
    signedoffBy: string;

    client:  any;
    project: any;

    projectName: string;
    clientName: string;
  
  }
  
  