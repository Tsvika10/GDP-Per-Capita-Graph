import { Component, OnInit, Input } from '@angular/core';
import { CountryGdpDataList } from '../country-data';

@Component({
  selector: 'app-gdp-graph-canvas',
  templateUrl: './gdp-graph-canvas.component.html',
  styleUrls: ['./gdp-graph-canvas.component.scss']
})
export class GdpGraphCanvasComponent implements OnInit {

  duringUpdate = false;
  lineChartData = [
    { data: [], label: '' }
  ];
  lineChartLabels = ['2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];
  lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      yAxes: [{
        ticks: {
          callback: function (value, index, values) {
            return '$' + value;
          }
        }
      }]
    },

    defaults: {
      line: {
        spanGaps: true
      }
    },
    elements: {
      line: {
        fill: false
      }
    },
    legend: {
      onClick: _ => { },
      position: 'bottom'
    }
  };
  lineChartLegend: boolean = true;
  lineChartType: string = 'line';

  @Input() set countryGdpDataList(countryGdpDataList: CountryGdpDataList) {
    this.lineChartData = countryGdpDataList.list;
    let newList = [];
    for (let i = countryGdpDataList.startYear; i <= countryGdpDataList.endYear; i++) {
      newList.push(i);
    }
    this.lineChartLabels = newList;
  };

  ngOnInit() {
  }
}
