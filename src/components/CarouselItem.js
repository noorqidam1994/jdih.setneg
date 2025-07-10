import React from "react";

const CarouselItem = ({ item, onDetailClick }) => {
  return (
    <div key={item.idperaturan} id={item.idperaturan}>
      <div className="card">
        <div className="card-body cardbodystyle">
          <div
            className="pl-1 pr-1 pt-1 pb-1 ml-0 mr-0 jdlAtas"
            onClick={() =>
              onDetailClick(
                item.jns,
                item.no_peraturan,
                item.tahun
              )
            }
          >
            <p className="group inner list-group-item-text pstyle d1">
              {item.nama_jenis.toUpperCase()}
            </p>
            <p className="group inner list-group-item-text pstyle d2">
              NOMOR {item.no_peraturan} TAHUN {item.tahun}
            </p>
            <p className="group inner list-group-item-text d4">
              {item.tentang.toLowerCase()}
            </p>
          </div>
        </div>
        <div className="card-footer text-muted mt-1 pt-1 pb-1 pl-2 pr-2 text-center">
          <span
            className="d_t_l _span_1 _c_span_ tooltipx"
            data-original-title="Detail Peraturan"
            onClick={() =>
              onDetailClick(
                item.jns,
                item.no_peraturan,
                item.tahun
              )
            }
          >
            <button
              className="btn-blue-grey waves-effect waves-light btn btn-md"
              type="submit"
            >
              DETAIL
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;