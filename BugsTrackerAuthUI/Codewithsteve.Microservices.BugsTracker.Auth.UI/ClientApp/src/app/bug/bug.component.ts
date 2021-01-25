import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { IBug } from '../_interfaces/bug-interface';
import { IClient } from '../_interfaces/client-interface';
import { Bug } from '../_models/bug-model';
import { EditBugComponent } from './edit-bug/edit-bug.component';

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

  modalRef: BsModalRef;
  modalConfig = {
      animated: true,
      class: 'modal-md',
      backdrop: true,
      ignoreBackdropClick: true,
      keyboard : true,
  }
 

  constructor(
    private modalService: BsModalService, 
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public appService: AppService) { }

  ngOnInit() {
    this.spinner.show();
    this.appService.getBugs();
    this.getBugs();
    this.appService.getClients();

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


  getBugs() {

    this.appService.bugs.subscribe((data: IBug[]=[])=>{
      console.log(data)
      if (data.length > 0) {
        this.bugs=data;
      
      }
      this.spinner.hide();

    })
  }

  getClients() {

    this.appService.clients.subscribe((data: IClient[]=[])=>{
      console.log(data)
      if (data.length > 0) {
        this.clients=data;
      
      }
    })
  }

  newBug() {

    this.getClients();
    const initialState = {
      bug: new Bug(),
      mode: 'New',
      clients: this.clients
    };
    this.modalRef = this.modalService.show(EditBugComponent, Object.assign({}, this.modalConfig, { class: 'modal-md', initialState }));
    this.modalRef.content.closeBtnName = 'Close';
  }

  editBug(bug: Bug) {

    this.getClients();
    this.appService.getBug(bug.bugId).subscribe((bug$: Bug) => { this.bug = bug$;
         
      if (bug$) {
        const initialState = {
          bug: bug$,
          mode: 'Edit',
          clients: this.clients
        };
        this.modalRef = this.modalService.show(EditBugComponent, Object.assign({}, this.modalConfig, { class: 'modal-md', initialState }));
        this.modalRef.content.closeBtnName = 'Close';
      }
    });
  
  
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
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.deleteBug(this.selectedBug);
    this.modalRef.hide();
  }
 
  decline(): void {
    this.modalRef.hide();
  }
 
}


