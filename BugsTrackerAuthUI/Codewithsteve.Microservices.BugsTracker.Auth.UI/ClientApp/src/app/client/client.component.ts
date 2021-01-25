import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from '../app.service';
import { IClient } from '../_interfaces/client-interface';
import { EditClientComponent } from './edit-client/edit-client.component';
import { Client } from '../_models/client-model ';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  clients: IClient[]=[];
  client: IClient;
  selectedClient: IClient;

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
    this.appService.getClients();
    this.getClients();
  }

  getClients() {

    this.appService.clients.subscribe((data: IClient[]=[])=>{
      console.log(data)
      if (data.length > 0) {
        this.clients=data;
      
      }
      this.spinner.hide();

    })
  }

  newClient() {
    const initialState = {
      client: new Client(),
      mode: 'New'
    };
    this.modalRef = this.modalService.show(EditClientComponent, Object.assign({}, this.modalConfig, { class: 'modal-md', initialState }));
    this.modalRef.content.closeBtnName = 'Close';
  }

  editClient(client: Client) {

    this.appService.getClient(client.clientId).subscribe((client$: Client) => { this.client = client$;
         
      if (client$) {
        const initialState = {
          client: client$,
          mode: 'Edit'
        };
        this.modalRef = this.modalService.show(EditClientComponent, Object.assign({}, this.modalConfig, { class: 'modal-md', initialState }));
        this.modalRef.content.closeBtnName = 'Close';
      }
    });
  
  
  }

  canDelete(client) {

    if (client!==null) {
      return (Number(client.totalBugs)===0); 
    }
  }

  deleteClient(client: Client){
    
    this.appService.deleteClient(client.clientId).subscribe(()=> { 
      this.appService.getClients();
      this.getClients();

      this.toastr.success(`Client app was succesfully deleted from the database.`,'Deleted!' ,{timeOut: 2000});
    
    });

  }

  openModal(template: TemplateRef<any>,client: Client) {

    this.selectedClient=client;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.deleteClient(this.selectedClient);
    this.modalRef.hide();
  }
 
  decline(): void {
    this.modalRef.hide();
  }
 
}

