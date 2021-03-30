import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  checkStatus(status) {

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
