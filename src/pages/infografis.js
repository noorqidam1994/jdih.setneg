import React, { useEffect, useState  } from 'react';
import Page from '../components/page';
import Pagination from "react-js-pagination";
import moment from 'moment';
import cookiee from "js-cookie";
// Import cookie only on server side
let cookie;
if (typeof window === 'undefined') {
  cookie = require('cookie');
}
import { server } from '../config';
import axiosInstance from '../lib/axiosInstance';

const Infografis = ({ data }) => {
  const [dinfografis, setdinfografis] = useState(data.isidata.result.data);
  const [totalRecord, setTotalRecords] = useState(data.isidata.result.jml);
  const [currentPage, setCurrentPage] = useState(1);
  let idLocale = require('moment/locale/id');
  moment.updateLocale('id', idLocale);

  useEffect(() => {
    setCurrentPage(data.pagexx);
    let imgtags = document.querySelectorAll("div.stringTag img");
    imgtags.forEach(async (element, e) => {
      let elm = element.src.split('/')
      let jd_img = elm[4]+'.'+elm[5];
      await fetch(`${server}/api/imgtinymce?img=`+jd_img, {
        method: 'GET',
        headers: { 'Accept': '*/*' }
      })
      .then(res => res.blob())
      .then(images => {
      let outside = URL.createObjectURL(images)
      console.log(images)
      element.src = outside;
      })
      .catch(err=> console.log(err)) 
    });
  }, []);
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    cookiee.set("page_inf", pageNumber, { secure: true, expires: 7, path: '/' });
    router.reload(window.location.pathname)
  }
    return(
      <Page title="Info Grafis">
      <div className="row ml-0 mr-0 mt-5 pt-4 mb-5">
      <div className='container'>
      {undefined !== dinfografis && 0 < dinfografis.length ? dinfografis.map((post, x) => (
      <div className="row" key={x}>
      <div className="col-lg-12 col-md-12">
      <div className="card card-cascade narrower mb-0 d_j_f0 scrollHor mt-5" >
      <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
      <h6 className="h6-responsive mb-0 pl-2"> INFOGRAFIS</h6>
      </div>
      <div className="row card-body pt-3 pb-3 mr-1 ml-0 pr-0 pl-0">
      <div className="col-md-12 pl-3 pr-1">
      <h4 className="h6-responsive">{post.judul}</h4>
      <div className="stringTag pb-2" dangerouslySetInnerHTML={{ __html: post.isi }}></div>
      </div>
      </div>
      <div className="card-footer text-muted mt-1 pt-1 pb-1 pl-2 pr-2">
      <span className="d_t_l _span_1 _c_span_ tooltipx" data-original-title={post.tgl}><i className="fas fa-calendar-alt"></i> <span className="fontspanFotterAwal"><span className="txet-liak-segok">{post.tgl}</span></span></span>
      <span className="d_t_l _span_1 _c_span_ tooltipx" data-original-title="Infografis"><i className="fas fa-tags"></i> <span className="font_minmax"><span className="txet-liak-segok">INFO GRAFIS</span></span></span>
      </div>
      </div>
      </div>
      </div>
      )) : <h5 className="mt-4 col-md-12 text-center">Data Putusan Pengadilan Kosong...!</h5>}
      {undefined !== dinfografis && 0 < dinfografis.length && (
      <Pagination
        itemClass="page-item"
        linkClass="page-link waves-effect"
        activePage={currentPage}
        itemsCountPerPage={5}
        totalItemsCount={totalRecord}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />
      )}
      </div>
      </div>
      </Page>
    )
}
export async function getInfografis(crnPg, lmtDt) {
  let length = lmtDt, 
      start = (crnPg - 1) * lmtDt;
      
      const resOpt = {
        length: length, 
        start: start
      }
  const res_p = await axiosInstance.post('/api/infografis_m', resOpt);
  if(res_p.status === 500) {
    return { result: {data: '', jml: ''}}
  } else {
    const resx = await res_p.data
    return { result: resx}
  }
}

export async function getServerSideProps(context) {
  let pagexx;
  if (context.req && context.req.headers && context.req.headers.cookie && cookie) {
    const prse = cookie.parse(context.req.headers.cookie)
      if(prse.page_inf !== '' && prse.page_inf !== undefined) {
        pagexx = parseInt(prse.page_inf);
      } else {
        pagexx = 1
      }
      
    } else {
      pagexx = 1;
    }
  const [isidata] = await Promise.all([
    getInfografis(pagexx, 5)
  ]);
  return { props: { data: { isidata, pagexx} } };
}

export default Infografis