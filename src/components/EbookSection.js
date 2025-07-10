import React from "react";

const EbookSection = ({ ebookData, onViewClick }) => {
  if (!ebookData?.data || ebookData.data.length === 0) {
    return <p>No e-book data available</p>;
  }

  const ebook = ebookData.data[0];

  return (
    <ul className="grid" id="listEbook">
      <li>
        <div className="grid_a">
          <p
            id="judul"
            className="line-clamp line-clamp-6"
            title={ebook.judul}
          >
            {ebook.judul}
          </p>
          <div className="ket">
            <i className="fas fa-search" aria-hidden="true"></i>{" "}
            {ebook.lihat}{" "}
            <span id="ket_jrk">Dilihat</span>
          </div>
          <div className="ket">
            <i className="fas fa-download" aria-hidden="true"></i>{" "}
            {ebook.unduh}{" "}
            <span id="ket_jrk">Diunduh</span>
          </div>
          <div className="ket">
            <i className="fas fa-file" aria-hidden="true"></i>{" "}
            {ebook.page}{" "}
            <span id="ket_jrk">Page</span>
          </div>
          <div
            className="view_icn"
            onClick={() => onViewClick(ebook.idebook, ebook.file_jj[0])}
          >
            <i className="fas fa-file-pdf"></i> LIHAT
          </div>
        </div>
        <div className="grid_b">
          <div className="view_icn">
            <i className="fas fa-file-pdf"></i> UNDUH
          </div>
        </div>
      </li>
    </ul>
  );
};

export default EbookSection;