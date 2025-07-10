import React from "react";
import moment from "moment";

const GallerySection = ({ galleryData, isClient, onGalleryClick }) => {
  if (!galleryData || galleryData.length === 0) {
    return <p>No gallery data available</p>;
  }

  const gallery = galleryData[0];

  return (
    <div className="card col-xl-12 col-lg-12 col-md-12 mb-3 mt-3 g_leri">
      <div
        className="view overlay"
        id="photos"
        onClick={() => onGalleryClick(gallery.id)}
      >
        <div id={gallery.id}></div>
        <a href="#" onClick={(e) => e.preventDefault()}>
          <div className="mask rgba-white-slight waves-effect waves-light"></div>
        </a>
      </div>
      <div
        className="card-body pt-0 pl-2 pr-2 pb-0"
        style={{ background: "#e3e7e7" }}
      >
        <h6 className="card-title text-center mb-0">
          {gallery.judul}
        </h6>
      </div>
      <div className="rounded-bottom mdb-color lighten-3 text-center text-white numbersxx">
        <i className="far fa-clock pr-1"></i>
        {isClient
          ? moment(gallery.tgl).format("LLL")
          : moment(gallery.tgl).utc().format("LLL")}
      </div>
    </div>
  );
};

export default GallerySection;