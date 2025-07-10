import React from "react";
import GallerySection from "./GallerySection";
import EbookSection from "./EbookSection";
import { domUtils } from "../utils/domUtils";
import { server } from "../config";

const InfoSection = ({ data, isClient, onGalleryClick }) => {
  const handleEbookView = (id, fileName) => {
    domUtils.openWindow(`${server}/api/ebook/pdf?fl=${id}&f=${fileName}`);
  };

  return (
    <div className="col-lg-12 col-md-12">
      <div className="card card-cascade narrower">
        <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
          <h5 className="h5-responsive mb-0 pl-2">
            Informasi Lainnya
          </h5>
        </div>
        <div className="card-body pt-0 pr-0 pl-0 pb-0">
          <div className="col-xl-12 col-lg-12 col-md-12 row">
            <div className="col-lg-4 col-md-6">
              <h5 className="h5-responsive mb-1 mt-3 pl-2">
                Infografis
              </h5>
            </div>
            <div className="col-lg-4 col-md-6">
              <h5 className="h5-responsive mb-1 mt-3 pl-2">Galeri</h5>
              <GallerySection
                galleryData={data.isidatagaleri}
                isClient={isClient}
                onGalleryClick={onGalleryClick}
              />
            </div>
            <div className="col-lg-4 col-md-6">
              <h5 className="h5-responsive mb-1 mt-3 pl-2">E-book</h5>
              <EbookSection
                ebookData={data.isiebook}
                onViewClick={handleEbookView}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;