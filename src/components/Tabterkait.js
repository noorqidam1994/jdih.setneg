import React , { useEffect, useState }from 'react';

const Tabterkait = ({ dtatabs }) => {
  const [rowDataAts, setrowDataAts] = useState(dtatabs);
    useEffect(() => {
        const swiperterkaitthumb = new Swiper('.tab-menuterkait', {
            observer: true,
            observeParents: true,
            spaceBetween: 5,
            slidesPerView: 6,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            autoHeight: true,
            breakpoints: {
            320: {
              slidesPerView: 2,
              spaceBetween: 5,
            },
            360: {
              slidesPerView: 2,
              spaceBetween: 5,
            },
            414: {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 5,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 5,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 5,
            },
            }
        });
        const swiperContent = new Swiper('.tab-contentterkait', {
            observer: true,
            observeParents: true,
            spaceBetween: 5,
            thumbs: {
            swiper: swiperterkaitthumb
            }
        });

        return () => {
            try {
                if (swiperterkaitthumb && typeof swiperterkaitthumb.destroy === 'function') {
                    swiperterkaitthumb.destroy(true, true);
                }
            } catch (error) {
                console.warn('Error destroying swiperterkaitthumb:', error);
            }
            
            try {
                if (swiperContent && typeof swiperContent.destroy === 'function') {
                    swiperContent.destroy(true, true);
                }
            } catch (error) {
                console.warn('Error destroying swiperContent:', error);
            }
        };
      }, []);

    return (
        <div>
        {undefined !== rowDataAts ? (
        <div className="card card-cascade narrower mb-3 d_j_f3 mt-5">
        <div className="view view-cascade gradient-card-header light-blue lighten-1">
        <h6 className="h6-responsive mb-0 pl-2">Peraturan Terkait</h6>
        </div>
        <div className="card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-3">
        <div className="swiper-container tab-menuterkait pb-2">
        <div className="swiper-wrapper" id="d_head_terkait_">
        {Object.keys(rowDataAts).map(function (key) {
          return (<div className="swiper-slide" key={key}>{key}</div>)
        })}
        </div>
        <div className="borderdebah"></div>
        </div>
        <div className="swiper-container tab-contentterkait">
        <div className="swiper-wrapper d_il_data" id="d_info_terkait_">
        {Object.keys(rowDataAts).map(function (key, id) {
          return (<div className="swiper-slide" key={id} dangerouslySetInnerHTML={{ __html: rowDataAts[key].join('') }}></div>)
        })}
        </div>
        </div>
        </div>
        </div>
        ) : (
          <div className="card card-cascade narrower mb-3 d_j_f3 mt-5">
          <div className="view view-cascade gradient-card-header light-blue lighten-1">
          <h6 className="h6-responsive mb-0 pl-2">Peraturan Terkait</h6>
          </div>
          <div className="card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-3">
          <p>&nbsp;</p>
          </div>
          </div>
          )}
        </div>
    );
  }

  export default Tabterkait