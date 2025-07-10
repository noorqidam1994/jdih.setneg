import React from "react";

const ChartCard = ({ title, children }) => (
  <div className="col-lg-4 col-md-6">
    <div className="card card-cascade narrower">
      <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
        <h5 className="h5-responsive mb-0 pl-2">{title}</h5>
      </div>
      <div className="card-body pt-0 pr-0 pl-0 pb-0">
        <div className="col-xl-12 col-lg-12 col-md-12 row">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const ChartSection = ({ AmChartStatus, AmChartKategori, AmChartTren, readDatatable, headtable }) => {
  return (
    <div className="row gy-4">
      <ChartCard title="Grafik Status Produk Hukum">
        <AmChartStatus dchart={{ readDatatable, headtable }} />
      </ChartCard>

      <ChartCard title="Grafik Kategori Produk Hukum">
        <AmChartKategori dchart={{ headtable }} />
      </ChartCard>

      <ChartCard title="Tren Produk Hukum">
        <AmChartTren dchart={{ headtable }} />
      </ChartCard>
    </div>
  );
};

export default ChartSection;