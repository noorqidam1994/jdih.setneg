import React, { useEffect, useState  } from 'react';
import { server } from '../config';
import axios from "axios";

const Ttinymce = ({ dataid }) => {
    const [stringdata, setStringdata] = useState();

    useEffect(() => {
        async function processImages() {
            for (const d of dataid) {
                let el = document.createElement('div');
                el.innerHTML = d.isi;
                const imgElements = el.querySelectorAll('img');
                
                for (const imgEl of imgElements) {
                    try {
                        let j_img = imgEl.src.split('/').filter(Boolean);
                        let jd_img = j_img[3]+'.'+j_img[4];
                        const res = await fetch(`${server}/api/imgtinymce?img=`+jd_img, {
                            method: 'GET',
                            headers: { 'Accept': '*/*' }
                        });
                        const outside = await res.blob();
                        if(outside !== "") {
                            imgEl.src = outside;
                        } else {
                            imgEl.src = '';
                        }
                        setStringdata(el.innerHTML);
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        }
        processImages();
      }, []);

    function createMarkup(c) {
        return { __html: c };
    }

    return (<div>{stringdata && <div dangerouslySetInnerHTML={createMarkup(stringdata)}></div>}</div>)
    // return(
    //     <div>
    //   {undefined !== dataid && 0 < dataid.length ? dataid.map( (d, k) => {
    //   return (
    //     <div className="row" key={k}>
    //       <div className="col-lg-12 col-md-12">
    //       <div className="card card-cascade narrower mb-0 d_j_f0 scrollHor mt-5" >
    //         <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
    //           <h6 className="h6-responsive mb-0 pl-2"> INFOGRAFIS</h6>
    //         </div>
    //         <div className="row card-body pt-3 pb-3 mr-1 ml-0 pr-0 pl-0">
    //         <div className="col-md-12 pl-3 pr-1">
    //           <h4 className="h6-responsive">{d.judul}</h4>
    //           {d.isi && <div dangerouslySetInnerHTML={createMarkup(d.isi)}></div>}
    //           </div>
    //         </div>
    //       <div className="card-footer text-muted mt-1 pt-1 pb-1 pl-2 pr-2">
    //       <span className="d_t_l _span_1 _c_span_ tooltipx" data-original-title={moment(d.tgl).format('LL')}><i className="fas fa-calendar-alt"></i> <span className="fontspanFotterAwal"><span className="txet-liak-segok">{moment(d.tgl).format('LL')}</span></span></span>
    //       <span className="d_t_l _span_1 _c_span_ tooltipx" data-original-title="Infografis"><i className="fas fa-tags"></i> <span className="font_minmax"><span className="txet-liak-segok">INFO GRAFIS</span></span></span>
    //       </div>
    //         </div>
    //       </div>
    //       </div>
    //       )
    //       }) : <h5 className="mt-4 col-md-12 text-center">Data Putusan Pengadilan Kosong...!</h5>}
    //     </div>
    // )
}

export default Ttinymce