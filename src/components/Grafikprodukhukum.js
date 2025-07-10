import React , { useEffect, useState, useRef }from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const Grafikprodukhukum = ({ dchart }) => {
    am4core.useTheme(am4themes_animated);
    useEffect(() => {
        let chart = am4core.create("chartdivkategori", am4charts.PieChart);
        chart.hiddenState.properties.opacity = 0;
        chart.data = dchart.headtable;
        
        var series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = "jml";
        series.dataFields.radiusValue = "jml";
        series.dataFields.category = "jns";
        series.slices.template.cornerRadius = 6;
        series.colors.step = 3;

        series.hiddenState.properties.endAngle = -90;

        chart.legend = new am4charts.Legend();
    }, []);

    return (
        <div id="chartdivkategori" style={{ width: "100%", height: "500px" }}></div>
    );
}

export default Grafikprodukhukum