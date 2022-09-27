import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { IBug } from '../_interfaces/bug-interface';
import { IClient } from '../_interfaces/client-interface';
import { Bug } from '../_models/bug-model';
import { EditBugComponent } from './edit-bug/edit-bug.component';

import * as data from '../data/data';

@Component({
  selector: 'app-bug',
  templateUrl: './bug.component.html',
  styleUrls: ['./bug.component.css']
})
export class BugComponent implements OnInit {
  bugs: IBug[]=[];
  clients: IClient[]=[];
  bug: IBug;
  selectedBug: IBug;
  loggedIn = false;
  roles: string;

  modalRef: BsModalRef;
  modalConfig = {
      animated: true,
      class: 'modal-md',
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard : true,
  }
 

  constructor(
    public route:Router,
    private modalService: BsModalService, 
    private toastr: ToastrService,
    private authService: MsalService,
    private spinner: NgxSpinnerService,
    public appService: AppService) { }

  ngOnInit() {
    this.spinner.show();
    // this.appService.getBugs();
    this.getBugs();
    // this.appService.getClients();
    this.checkAccount();

  }

  gotoContactme() {
    this.modalRef.hide();
    this.route.navigate(['/contact-admin']);
  }

  colourCode(bug) {

    if (bug!==null||bug!==undefined) {

      const severity = Number(bug.severity);
      if (severity>0&&severity<=5) {
        return 'green';
      }
      if (severity===9) {
        return 'orange';
      }
      if (severity>9) {
        return 'red';
      }
  
  
      
    }

   
  }

  calculateInfo(bug) {

    if (bug!==null||bug!==undefined) {

      const score = Number(bug.priority)*Number(bug.impact);

      if (score>0&&score<=5) {

        return 'Low Severity; Score: ' + `${score}`;
      }
      if (score===9) {

        return 'Medium Severity; Score: ' + `${score}`;
      }
      if (score>9) {

        return 'High Severity; Score: ' + `${score}`;
      }
  
  
      
    }

   
  }

  checkStatus(bug) {

    if (bug!==null||bug!==undefined) {
      const status = bug['status'];
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

  gotofeatures() {
    window.open('/about/#features', '_blank', 'location=yes,height=570,width=1040,scrollbars=yes,status=yes');
  }

 

  // getBugs() {

  //   this.appService.bugs.subscribe((data: IBug[]=[])=>{
  //     console.log(data)
  //     if (data.length > 0) {
  //       this.bugs=data;
      
  //     }
  //     this.spinner.hide();

  //   })
  // }

  // getClients() {

  //   this.appService.clients.subscribe((data: IClient[]=[])=>{
  //     console.log(data)
  //     if (data.length > 0) {
  //       this.clients=data;
      
  //     }
  //   })
  // }

  getBugs() {
    this.getClients();
    this.bugs=data.bugs;
    this.bugs.map(x=>{
      let rand = (Math.random().toString(36).substr(2, 8)).toUpperCase();
      x.clientName = x.bugId==''? this.clients.find(y=>y.clientId==x.clientId).name : x.clientName;
      x.bugCode = x.bugId==''? `BUG-${rand}`: x.bugCode;
      x.dateCreated = x.bugId==''? new Date().toLocaleDateString(): x.dateCreated;
    });
    this.spinner.hide();
  }

  getClients() {

    this.clients=data.clients;
  }

  newBug() {

    this.getClients();
    const initialState = {
      bug: new Bug(),
      mode: 'New',
      clients: this.clients
    };
    this.modalRef = this.modalService.show(EditBugComponent, Object.assign({}, this.modalConfig, { class: 'modal-lg', initialState }));
    this.modalRef.content.closeBtnName = 'Close';
  }

  editBug(bug: Bug) {

    this.getClients();
    // this.appService.getBug(bug.bugId).subscribe((bug$: Bug) => { this.bug = bug$;
    this.bug=this.bugs.find(x=>x.bugId==bug.bugId);
         
      if (this.bug) {
        const initialState = {
          bug: this.bug,
          mode: 'Edit',
          clients: this.clients
        };
        this.modalRef = this.modalService.show(EditBugComponent, Object.assign({}, this.modalConfig, { class: 'modal-lg', initialState }));
        this.modalRef.content.closeBtnName = 'Close';
      }
    // });
  
  
  }
  checkAccount() {
    this.loggedIn = !!this.authService.getAccount();
    this.update();
  }

  update() {
    const account = this.authService.getAccount();
    if (account!=null||account!=undefined) {

      this.roles = account.idToken.roles;
    }
  }


  deleteBug(bug: Bug){
    this.appService.deleteBug(bug.bugId).subscribe(()=> { 
      this.appService.getBugs();
      this.getBugs();

      this.toastr.success(`Bug was succesfully deleted from the database.`,'Deleted!' ,{timeOut: 2000});
    
    });

  }

  openModal(template: TemplateRef<any>,bug: Bug) {

    this.selectedBug=bug;
    this.modalRef = this.modalService.show(template, {class: 'modal-ms'});
  }
 
  confirm(): void {
    this.deleteBug(this.selectedBug);
    this.modalRef.hide();
  }
 
  decline(): void {
    this.modalRef.hide();
  }

  get isAdmin(): boolean { if(this.roles!=undefined&&this.roles.length>0) {return this.roles.includes('Admin')}};
 
}


