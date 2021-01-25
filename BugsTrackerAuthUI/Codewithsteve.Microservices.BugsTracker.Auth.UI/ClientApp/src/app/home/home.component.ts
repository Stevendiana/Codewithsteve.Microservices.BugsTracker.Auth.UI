import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'; 
import * as Chart from 'chart.js'
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from '../app.service';
import { IBug } from '../_interfaces/bug-interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  statusCount =[];
  chartOneData =[];
  chartTwoData = [];

  bug$: IBug[]=[];
  title = 'Chartjs';
  canvas: any;
  ctx: any;
  ctx2: any;
  mixcanvas: any;
  mixctx: any;

  chartlabelTwo = ["New", "In-Progress","Resolved","On-Hold"];
  chartlabelOne =  ["Low", "Medium","High"];

  constructor(public route:Router,  private spinner: NgxSpinnerService, public appService: AppService){} 

  ngOnInit(){
    this.spinner.show();
    this.appService.getBugs();
    this.getBugs();
  }

  gotoBugs() {
    this.route.navigate(['/bugs']);
  }

  gotoClients() {
    this.route.navigate(['/clients']);
  }

  transformData(data){

    this.chartlabelTwo.forEach(element => {

      var numStatus = data.reduce(function (n, item) {
        return n + (item.status == element);
      }, 0);

      if (element=='New') 
      this.chartTwoData[0]=numStatus;
      if (element=='In-Progress') 
        this.chartTwoData[1]=numStatus
      if (element=='Resolved') 
        this.chartTwoData[2]=numStatus
      if (element=='On-Hold') 
        this.chartTwoData[3]=numStatus
    
     
      
    });

    this.chartlabelOne.forEach(element => {

      var numStatus = data.reduce(function (n, item) {
        return n + (item.severitylevel == element);
      }, 0);

      if (element=='Low') 
      this.chartOneData[0]=numStatus;
      if (element=='Medium') 
        this.chartOneData[1]=numStatus
      if (element=='High') 
        this.chartOneData[2]=numStatus
      
    });

    console.log(this.chartOneData);

  
   

  }

  getBugs() {

    this.appService.bugs.subscribe((res)=>{
      console.log(res)
      if (res.length > 0) {
        this.bug$=res;
        this.transformData(this.bug$);
        this.chartOne();
        this.chartTwo()

      }
      this.spinner.hide();

    })
  }

  chartOne(){

    this.canvas = document.getElementById('myChart');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');

      let myChart = new Chart(this.ctx, {
        type: 'doughnut',
        data: {
            labels: ["Low", "Medium","High"],
            datasets: [{
                label: '# of Votes',
                data: this.chartOneData,
                backgroundColor: [
                    'rgba(153,204,153, 1)',
                    'rgba(255,174,25,1)',
                    'rgba(233,0,0,1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
          responsive: false,
          display:true
        }
      });
      
    }
    

  }

  chartTwo(){

    this.canvas = document.getElementById('myChart2');
    if (this.canvas) {
      this.ctx2 = this.canvas.getContext('2d');

      let myChart = new Chart(this.ctx2, {
        type: 'doughnut',
        data: {
            labels: ["New", "In-Progress","Resolved","On-Hold"],
            datasets: [{
                label: '# of Votes',
                data: this.chartTwoData,
                backgroundColor: [
                    'rgba(229,229,229,1)',
                    'rgba(153,204,153, 1)',
                    'rgba(0, 124, 0, 1)',
                    'rgba(255,174,25,1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
          responsive: false,
          display:true,
          tooltips: {
            enabled: true
          },
          // plugins: {
          //   datalabels: {
          //     formatter: (value, ctx2) => {
        
          //       let sum = ctx2.dataset._meta[0].total;
          //       let percentage = (value * 100 / sum).toFixed(2) + "%";
          //       return percentage;
        
        
          //     },
          //     color: '#fff',
          //   }
          // }
        }
      });
      
    }
    

  }

  checkSeverity(sev, label) {

    const severity = Number(sev);
    if ((severity>0&&severity<=5)&&label=='Low') {
      return severity;
    }
    if (severity==9&&label=='Medium') {
      return severity;
    }
    if (severity>9&&label=='High') {
      return severity;
    }


  }

 



  ngAfterViewInit() {

   
  }
}
