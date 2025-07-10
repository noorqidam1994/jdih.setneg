import { useEffect, useState } from "react";
import moment from "moment";
import Page from "../components/page";
import CustomLoadingScreen from "../components/Loading-screeen";
import dynamic from "next/dynamic";
import { useSearch } from "../hooks/useSearch";
import { useGallery } from "../hooks/useGallery";
import { useRegulationDetail } from "../hooks/useRegulationDetail";
import { domUtils } from "../utils/domUtils";
import CarouselItem from "../components/CarouselItem";
import ChartSection from "../components/ChartSection";
import InfoSection from "../components/InfoSection";
import { UI_CONSTANTS } from "../constants/ui";
import { apiService } from "../services/apiService";

const OwlCarousel = dynamic(() => import("react-owl-carousel"), { ssr: false });
const AmChartKategori = dynamic(
  () => import("../components/Grafikprodukhukum"),
  { ssr: false }
);
const AmChartStatus = dynamic(() => import("../components/Matrikchart"), {
  ssr: false,
});
const AmChartTren = dynamic(() => import("../components/Trengrafik"), {
  ssr: false,
});
const ReactImageVideoLightbox = dynamic(() => import("../public/imagevideo"), {
  ssr: false,
});

const HomePage = ({ data }) => {
  const { handleSearch, handleKeyPress } = useSearch();
  const { handleRegulationDetail } = useRegulationDetail();
  const { listGaleri, lightboxOpen, handleGalleryClick, closeLightbox } = useGallery(data.isidatagaleri);
  
  const [showLoading] = useState(false);
  const [dperaturan] = useState(data.terbaru.data);
  const [headtable] = useState(data.atsHead.data);
  const [readDatatable] = useState(data.isiTable.result);
  const [isClient, setIsClient] = useState(false);
  
  const idLocale = require("moment/locale/id");
  moment.updateLocale(UI_CONSTANTS.MOMENT_LOCALE, idLocale);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleClickClose = () => {
    domUtils.setValue(UI_CONSTANTS.SEARCH_INPUT_ID, "");
    domUtils.hideElement(UI_CONSTANTS.SEARCH_CLOSE_BUTTON_SELECTOR);
  };

  const handleClickbtnSearch = () => {
    const searchValue = domUtils.getValue(UI_CONSTANTS.SEARCH_INPUT_ID);
    handleSearch(searchValue);
  };

  const onKeyPressSearch = (x) => {
    domUtils.setValue(UI_CONSTANTS.SEARCH_INPUT_ID, x.target.value);
    handleKeyPress(x);

    if (x.target.value === "") {
      domUtils.hideElement(UI_CONSTANTS.SEARCH_CLOSE_BUTTON_SELECTOR);
    } else {
      domUtils.showElement(UI_CONSTANTS.SEARCH_CLOSE_BUTTON_SELECTOR);
    }
  };


  return (
    <div>
      {showLoading && <CustomLoadingScreen />}
      <Page title="Beranda">
        <section>
          <div className="sepok">
            <div className="gmbarAwal">
              <img src="/img/jdihsetneg.png" className="imgLogo" alt="" />
            </div>
            <div className="search-box">
              <form
                className="search-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="form-control"
                  autoFocus
                  id="sepokberanda"
                  placeholder={UI_CONSTANTS.SEARCH_PLACEHOLDER}
                  style={{ fontSize: "1.2rem" }}
                  type="text"
                  onKeyDown={onKeyPressSearch}
                  autoComplete="off"
                />
                <button
                  className="search-btn s-btn-close s_beranda pt-1"
                  onClick={handleClickClose}
                >
                  <i className="fas fa-times"></i>
                </button>
                <button
                  className="search-btn s_beranda pt-1"
                  onClick={handleClickbtnSearch}
                >
                  <i className="fa fa-search" aria-hidden="true"></i>
                </button>
              </form>
            </div>
            <div className="gtco-testimonials mt-1">
              <OwlCarousel
                className="owl-theme"
                loop
                autoplay
                center
                margin={0}
                nav
                responsive={UI_CONSTANTS.CAROUSEL_RESPONSIVE}
                navText={[
                  UI_CONSTANTS.CAROUSEL_NAV_TEXT.PREV,
                  UI_CONSTANTS.CAROUSEL_NAV_TEXT.NEXT,
                ]}
              >
                {undefined !== dperaturan && 0 < dperaturan.length ? (
                  dperaturan.map((d) => (
                    <CarouselItem
                      key={d.idperaturan}
                      item={d}
                      onDetailClick={handleRegulationDetail}
                    />
                  ))
                ) : (
                  <h5 className="mt-4 col-md-12 text-center">
                    {UI_CONSTANTS.EMPTY_MESSAGES.REGULATIONS}
                  </h5>
                )}
              </OwlCarousel>
            </div>
          </div>
        </section>
        <section
          id="services"
          className="services section light-background mt-5 mb-5"
        >
          <div className="container">
            <div className="row gy-4">
              <ChartSection
                AmChartStatus={AmChartStatus}
                AmChartKategori={AmChartKategori}
                AmChartTren={AmChartTren}
                readDatatable={readDatatable}
                headtable={headtable}
              />

              <InfoSection
                data={data}
                isClient={isClient}
                onGalleryClick={handleGalleryClick}
              />
            </div>
          </div>
        </section>
        {lightboxOpen && (
          <ReactImageVideoLightbox
            data={listGaleri}
            startIndex={0}
            showResourceCount={true}
            onCloseCallback={closeLightbox}
            onNavigationCallback={() => {}}
          />
        )}
      </Page>
    </div>
  );
};


export async function getServerSideProps() {
  try {
    const atsHead = await apiService.getMatrixData();
    const arrID = atsHead.data.map(item => item.idjenis);
    
    const [isiTable, terbaru, isidatagaleri, isiebook] = await Promise.all([
      apiService.getYearRegulations(arrID),
      apiService.getRegulations("semua", "Terbaru", "", 1, 9, "", "", ""),
      apiService.getGalleryData(),
      apiService.getEbookData(),
    ]);

    return {
      props: {
        data: { terbaru, atsHead, isiTable, isidatagaleri, isiebook },
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        data: {
          terbaru: { data: [] },
          atsHead: { data: [] },
          isiTable: { result: [] },
          isidatagaleri: [],
          isiebook: { data: [], jml: 0 },
        },
      },
    };
  }
}

export default HomePage;
