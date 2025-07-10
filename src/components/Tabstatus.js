import React , { useEffect, useState }from 'react';

const Tabstatus = ({ dtatabs }) => {
  const [rowDataAts, setrowDataAts] = useState(dtatabs.i_bwh);
  const [rowDataBwh, setrowDataBwh] = useState(dtatabs.i_ats);

    useEffect(() => {
        const swiperstatusthumb = new Swiper('.tab-menustatus', {
            observer: true,
            observeParents: true,
            spaceBetween: 5,
            slidesPerView: 5,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            autoHeight: true,
            breakpoints: {
            320: {
              slidesPerView: 1,
              spaceBetween: 5,
            },
            360: {
              slidesPerView: 1,
              spaceBetween: 5,
            },
            414: {
              slidesPerView: 2,
              spaceBetween: 5,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 5,
            },
            }
        });
        const swiperContent = new Swiper('.tab-contentstatus', {
            observer: true,
            observeParents: true,
            spaceBetween: 5,
            thumbs: {
            swiper: swiperstatusthumb
            }
        });

        return () => {
            try {
                if (swiperstatusthumb && typeof swiperstatusthumb.destroy === 'function') {
                    swiperstatusthumb.destroy(true, true);
                }
            } catch (error) {
                console.warn('Error destroying swiperstatusthumb:', error);
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
        {0 < rowDataAts.length ? (
        <div className="card card-cascade narrower mb-3 d_j_f2 mt-5">
        <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
        <h6 className="h6-responsive mb-0 pl-2">Status Peraturan</h6>
        </div>
        <div className="card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-3">
        <div className="swiper-container tab-menustatus pb-2">
        <div className="swiper-wrapper" id="d_head_status_">
          {rowDataAts.map(function(item, idx) {
            return (<div className="swiper-slide" key={idx}>{item}</div>)
          })}
        </div>
        <div className="borderdebah"></div>
        </div>
        <div className="swiper-container tab-contentstatus">
        <div className="swiper-wrapper d_il_data" id="d_info_">
        {rowDataBwh.map(function(item, idx) {
          return (<div className="swiper-slide" key={idx} dangerouslySetInnerHTML={{ __html: item }}></div>)
        })}
        </div>
        </div>
        </div>
        </div>
        ) : (
          <div className="card card-cascade narrower mb-3 d_j_f2 mt-5">
          <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
          <h6 className="h6-responsive mb-0 pl-2">Status Peraturan</h6>
          </div>
          <div className="card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-3">
          <p>&nbsp;</p>
          </div>
          </div>
          )}
        </div>
    );
  }

  export default Tabstatus