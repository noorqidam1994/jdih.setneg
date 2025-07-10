import { useEffect, useState } from "react";
import { galleryService } from "../services/galleryService";

export const useGallery = (galleryData) => {
  const [listGaleri, setListGaleri] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (galleryData?.length > 0 && galleryData[0].img) {
      galleryData[0].img.forEach((image) => {
        galleryService.loadAndAppendMedia(
          image.file,
          galleryData[0].id,
          image.ext
        );
      });
    }
  }, [galleryData]);

  const handleGalleryClick = (id) => {
    const allMedia = galleryService.extractMediaFromElement(id);
    setListGaleri(allMedia);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return {
    listGaleri,
    lightboxOpen,
    handleGalleryClick,
    closeLightbox,
  };
};