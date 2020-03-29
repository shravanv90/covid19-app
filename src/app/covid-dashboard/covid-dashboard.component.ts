import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Chart from 'chart.js'


@Component({
  selector: 'app-covid-dashboard',
  templateUrl: './covid-dashboard.component.html',
  styleUrls: ['./covid-dashboard.component.css']
})
export class CovidDashboardComponent implements OnInit {
  title = 'Covid19 Graph';
  canvas: any;
  ctx: any;
  response : any;
  stateData : any;
  stateDataHistory : any;
  state =[];
  confirmedCaseIndian =[];
  confirmedCaseForeign =[];
  discharged =[];
  deaths =[];




  constructor(svc: CovidService, private http:HttpClient) {
    
   }

  ngOnInit(): void {
    let headers:HttpHeaders = new HttpHeaders();
    headers = headers.append("x-rapidapi-host", "covid-193.p.rapidapi.com");
    headers = headers.append("x-rapidapi-key", "74731208d8msh6bea69690a74b30p181740jsn6d1175633b02");
    
    this.http.get('https://covid-193.p.rapidapi.com/statistics?country=India',{headers})
    .subscribe((response) => 
      {this.response = response;
      console.log("Got the Response..!!", response)
    });

  }

  public barChartData: any[] = [
    { data: [], label: 'Total Cases' },
    
  ];

  getStateData(){
 
    this.http.get('https://api.rootnet.in/covid19-in/stats/latest')
    .subscribe((response) => 
      {this.stateData = response;
      this.stateData = JSON.stringify(this.stateData);
      this.stateData = JSON.parse(this.stateData);
      //console.log("State Data response..!!", this.stateData)
      
      for (let i=0;i<this.stateData.data.regional.length ;i++){
        this.state.push(this.stateData.data.regional[i].loc)
        this.confirmedCaseIndian.push(this.stateData.data.regional[i].confirmedCasesIndian)
        this.confirmedCaseForeign.push(this.stateData.data.regional[i].confirmedCasesForeign)
        this.discharged.push(this.stateData.data.regional[i].discharged)
        this.deaths.push(this.stateData.data.regional[i].deaths)
        

      }
      
      console.log("Confirmed cases Indian SUM..", this.confirmedCaseIndian.reduce((a,b) => a+b,0));
      this.canvas = document.getElementById('myChart');
      this.ctx = this.canvas.getContext('2d');
      let myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
          labels: ["Confirmed Cases Indian", "Confirmed Cases Foreign","Discharged","Deaths"],
          datasets: [{
              label: 'State Data',
              data: [
                this.confirmedCaseIndian.reduce((a,b) => a+b,0),
                this.confirmedCaseForeign.reduce((a,b) => a+b,0),
                
                this.discharged.reduce((a,b) => a+b,0),
                this.deaths.reduce((a,b) => a+b,0),],
              backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(54, 162, 23, 1)',
                  
              ],
              borderWidth: 1
          }]
      },
      options: {
        responsive: false,
        display:true
      }
    });


    });

    

  }


  


}

