import React , { useEffect, useState }from 'react';
import moment from 'moment';
import { server } from '../config';

const Tabujimateril = ({ dtatabs }) => {
    let idLocale = require('moment/locale/id');
    moment.updateLocale('id', idLocale);
    const [rowDataAts, setrowDataAts] = useState(dtatabs);
    
      useEffect(() => {
          const swiperujithumb = new Swiper('.tab-menuuji', {
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
        const swiperContent = new Swiper('.tab-contentuji', {
            observer: true,
            observeParents: true,
            spaceBetween: 5,
            thumbs: {
            swiper: swiperujithumb
            }
        });

        return () => {
            try {
                if (swiperujithumb && typeof swiperujithumb.destroy === 'function') {
                    swiperujithumb.destroy(true, true);
                }
            } catch (error) {
                console.warn('Error destroying swiperujithumb:', error);
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

        function clickViewTabsPdf(f, id) {
            fetch(`${server}/api/hukumproduk/pdf?f=`+f+`&fl=`+id)
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(url => window.open(url, '_blank', 'noopener,noreferrer'))
            .catch(error => this.setState({
                  error
              }));
        }
  
      return (
        <>
        {0 < rowDataAts.length ? (
        <div className="card card-cascade narrower mb-3 d_j_f4 mt-5">
        <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
        <h6 className="h6-responsive mb-0 pl-2">Putusan Uji Materil</h6>
        </div>
        <div className="card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-3">
        <div className="swiper-container tab-menuuji pb-2">
        <div className="swiper-wrapper" id="d_head_uji_">
        {rowDataAts.map(function(item, idx) {
            return (<div className="swiper-slide" key={idx} style={{fontSize: '.9rem'}}>{item.nomor}</div>)
        })}
        </div>
        <div className="borderdebah"></div>
        </div>
        <div className="swiper-container tab-contentuji">
        <div className="swiper-wrapper d_il_data" id="d_info_uji_">
        {rowDataAts.map(function(item, idx) {
            return (
            <div className="swiper-slide" key={idx}>
            <div className="row ml-0 mr-0 col-md-12 pl-0 pr-0 mb-1">
            <div className="col-md-12 pl-0 pr-0">
            <div className="ujimaterilIsi">Nomor</div>
            <div className="ujimaterilIsi" style={{width: '.5rem'}}>:</div>
            <div style={{textAlign: 'left'}}>{item.nomor}</div>
            </div>
            </div>
            <div className="row ml-0 mr-0 col-md-12 pl-0 pr-0 mb-1">
            <div className="col-md-12 pl-0 pr-0">
            <div className="ujimaterilIsi">Tanggal</div>
            <div className="ujimaterilIsi" style={{width: '.5rem'}}>:</div>
            <div style={{textAlign: 'left'}}>{moment(item.tanggal).format('LL')}</div>
            </div>
            </div>
            <div className="row ml-0 mr-0 col-md-12 pl-0 pr-0 mb-1">
            <div className="col-md-12 pl-0 pr-0">
            <div className="ujimaterilIsi">Putusan</div>
            <div className="ujimaterilIsi" style={{width: '.5rem'}}>:</div>
            <div style={{textAlign: 'left'}} dangerouslySetInnerHTML={{ __html: item.intisari }}></div>
            </div>
            </div>
            {0 < item.filex.length && (
            <div className="row ml-0 mr-0 col-md-12 pl-0 pr-0 mb-1">
            <div className="col-md-12 pl-0 pr-0">
            <div className="ujimaterilIsi">Jumlah File</div>
            <div className="ujimaterilIsi" style={{width: '.5rem'}}>:</div>
            <div style={{textAlign: 'left'}}>{item.filex.length}</div>
            </div>
            <div style={{textAlign: 'left'}} dangerouslySetInnerHTML={{ __html: item.filex }}></div>
            </div>
            )}
            </div>)
        })}
        </div>
        </div>
        </div>
        </div>
        ) : (
          <div className="card card-cascade narrower mb-3 d_j_f4 mt-5">
          <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
          <h6 className="h6-responsive mb-0 pl-2">Putusan Uji Materil</h6>
          </div>
          <div className="card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-3">
            <p>&nbsp;</p>
            </div>
          </div>
          )}
        </>
      );
    }
  
    export default Tabujimateril