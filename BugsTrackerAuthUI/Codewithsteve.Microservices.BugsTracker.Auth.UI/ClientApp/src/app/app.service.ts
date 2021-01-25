import {of as observableOf, throwError as observableThrowError,  Observable ,  BehaviorSubject } from 'rxjs';
import {map, catchError, tap} from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { IBug } from './_interfaces/bug-interface';
import { IClient } from './_interfaces/client-interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Bug } from './_models/bug-model';
import { Client } from './_models/client-model ';


@Injectable()
export class AppService {
  appUrl: string = "";
  errorMessage: string;
  deleteMessage: string;
  
  public _bugs: BehaviorSubject<IBug[]>;
  public _clients: BehaviorSubject<IClient[]>;


  public bugStore: {
    bugs: any;
  };
  public projectStore: {
    projects: any;
  };
  public clientStore: {
    clients: any;
  };
 
  get bugs(): Observable<any> {
    return this._bugs.asObservable();
  }

  get clients(): Observable<any> {
    return this._clients.asObservable();
  }

 

  error(error: string) {
    return error;
  }

  projectById(id: string) {
    return this.projectStore.projects.find(x => x.projectId === id);
  }
  bugById(id: string) {
    return this.bugStore.bugs.find(x => x.bugId === id);
  }

  clientById(id: string) {
    return this.clientStore.clients.find(x => x.clientId === id);
  }

  

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string)
  // tslint:disable-next-line:one-line
  {
    this.appUrl = baseUrl;

    this.bugStore = { bugs: [] };
    this._bugs = new BehaviorSubject<IBug[]>([]);

    this.clientStore = { clients: [] };
    this._clients = new BehaviorSubject<IClient[]>([]);

    
  }

  private handleError(error: Response): Observable<any> {

    return observableThrowError('Something went wrong!');
  }


 
  getBugs() {

    this.http.get(this.appUrl + 'api/bug').subscribe(response => {
        console.log(response);
        this.bugStore.bugs = [];
        this.bugStore.bugs = response;
        this._bugs.next(Object.assign({}, this.bugStore).bugs);
    }, error => {
      console.log('Failed to fetch bugs');
    });
  }

  getClients() {

    this.http.get(this.appUrl + 'api/client').subscribe(response => {
        console.log(response);
        this.clientStore.clients = [];
        this.clientStore.clients = response;
        this._clients.next(Object.assign({}, this.clientStore).clients);
    }, error => {
      console.log('Failed to fetch clients');
    });
  }

 
  // post new

  postBug(bug) {

    return this.http.post(this.appUrl + 'api/bug', bug).pipe(
        map(res => {
        this.bugStore.bugs=[];
        this.bugStore.bugs.push(res);
        this._bugs.next(Object.assign({}, this.bugStore).bugs);
        
        console.log(res); 
    }));
   
  }

  saveBug(bug) {

    return this.http.put(this.appUrl + 'api/bug/' + bug['bugId'], bug).pipe(
        map(res => {
            
        this.bugStore.bugs=[];
        this.bugStore.bugs.push(res);
        this._bugs.next(Object.assign({}, this.bugStore).bugs);
        
        console.log(res); 
    }));
 }

 
  postClient(client) {

    // tslint:disable-next-line:max-line-length
    return this.http.post(this.appUrl + 'api/client', client).pipe(
    map(res => {
      
      this.clientStore.clients=[];
      this.clientStore.clients.push(res);
      this._clients.next(Object.assign({}, this.clientStore).clients);
     
      console.log(res); 
    }));
  }

  saveClient(client) {

    // tslint:disable-next-line:max-line-length
    return this.http.put(this.appUrl + 'api/client/' + client['clientId'], client).pipe(
    map(res => {
        
      this.clientStore.clients=[];
      this.clientStore.clients.push(res);
      this._clients.next(Object.assign({}, this.clientStore).clients);
     
      console.log(res); 
    }));
  }
 

  getBug(id: string) {

    return this.http.get(this.appUrl + 'api/bug/'  + id).pipe(map(res => res),
    tap(data => console.log('getBug: ' + JSON.stringify(data))),
    catchError (this.handleError),);

  }

 
  getClient(id: string) {

    return this.http.get(this.appUrl + 'api/client/'  + id).pipe(map(res => res),
    tap(data => console.log('getClient: ' + JSON.stringify(data))),
    catchError (this.handleError),);

  }

  deleteBug(id){
    return this.http.delete<Bug>(this.appUrl + 'api/bug/' + id)
    .pipe(
      catchError(this.handleError)
    )
  }

  deleteClient(id){
    return this.http.delete<Client>(this.appUrl + 'api/client/' + id)
    .pipe(
      catchError(this.handleError)
    )
  }
 

}
