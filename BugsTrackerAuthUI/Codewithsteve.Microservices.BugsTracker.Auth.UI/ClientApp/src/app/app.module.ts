import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { ClientComponent } from './client/client.component';
import { EditClientComponent } from './client/edit-client/edit-client.component';
import { BugComponent } from './bug/bug.component';
import { EditBugComponent } from './bug/edit-bug/edit-bug.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { AppFormService } from './app-form-service';
import { AppService } from './app.service';
import { PopoverModule } from 'ngx-bootstrap/popover';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    BugComponent,
    ClientComponent,
    EditClientComponent,
    EditBugComponent,
  ],
  entryComponents: [EditBugComponent,EditClientComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    PopoverModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent},
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'clients', component: ClientComponent },
      { path: 'bugs', component: BugComponent },
    ]),
  ],
  providers: [
    BsModalRef, AppFormService, AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



