import React , { useEffect, useState, useRef }from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const Matrikchart = ({ dchart }) => {
    let MatriksArray = [];
    dchart.readDatatable.map( (data, index) => {
      let arr = {};
        dchart.headtable.map( (dx, kx) => {
          data.value.map((item, i) => {
              if(dx.idjenis === item.idjenis) {
                arr['year'] = item.tahun
                arr[dx.jns] = item.jml
              }
            })
        })
        MatriksArray.push(arr);
    });
    //const sortArr = MatriksArray.sort((a,b) => a.year - b.year);
    const sorter = (a, b) => {
      if(a.year !== b.year){
         return b.year - a.year;
      }
    };
    MatriksArray.sort(sorter);
    useEffect(() => {
        let chart = am4core.create("chartdiv", am4charts.XYChart);
        // Add data
        chart.data = MatriksArray;
        
        // Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.grid.template.location = 0;
        
        
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.min = 0;
        
        // Create series
        function createSeries(field, name) {
          
          // Set up series
          let series = chart.series.push(new am4charts.ColumnSeries());
          series.name = name;
          series.dataFields.valueY = field;
          series.dataFields.categoryX = "year";
          series.sequencedInterpolation = true;
          
          // Make it stacked
          series.stacked = true;
          
          // Configure columns
          series.columns.template.width = am4core.percent(60);
          series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
          
          // Add label
          let labelBullet = series.bullets.push(new am4charts.LabelBullet());
          labelBullet.label.text = "{valueY}";
          labelBullet.locationY = 0.5;
          labelBullet.label.hideOversized = true;
          
          return series;
        }
        dchart.headtable.map( (d, k) => {
        createSeries(d.jns, d.jns);
        })
        // Legend
        chart.legend = new am4charts.Legend();

        return () => {
            chart.dispose();
        };
    }, []);  

    return (
        <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
      );

}

export default Matrikchart