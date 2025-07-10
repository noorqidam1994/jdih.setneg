import React, { useEffect, useState  } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import Page from '../components/page';
import CustomLoadingScreen from '../components/Loading-screeen';
import axiosInstance from '../lib/axiosInstance';
import axios from 'axios';
import https from 'https';
import { server } from '../config';
const Agent = new https.Agent({
  rejectUnauthorized: false
});
import {
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'next-share';

function Datetailputusan({ data }) {
  const router = useRouter();
  let lctx = router.asPath.slice(1).split('/');
  const [showLoading, setShowLoading] = useState(false);
  const [rowData, setRowData] = useState(data.valuedata.data[0]);
  const [rowFile, setrowFile] = useState();
  const [rowTerkait, setRowTerkait] = useState(data.d_status.result.data);
  const [rowFileabstrak, setrowFileabstrak] = useState();
  let idLocale = require('moment/locale/id');
  moment.updateLocale('id', idLocale);
  useEffect(() => {
      const filesx = [];
      const filesabstrak = [];
      data.valuedata.file.forEach(function (flx, dif) {
        let sub_ = flx.name.substring(0, 3), num_ = sub_.replace(/[^0-9.]\.+/g, ""), n_o = dif + 1, d_nama_;
        if (parseInt(num_) > 0) { d_nama_ = flx.name.replace(num_, ""); } else { d_nama_ = flx.name; }
        filesx.push(<div className="file_xx" key={n_o} onClick={() => clickViewPdf(flx.realName)}>
          <i className="fas fa-file-pdf ml-3 pr-1" style={{ color: 'red', fontSize: '1.1rem' }}></i> {n_o}.
          <p className="click_file_d1">{d_nama_.trim()} <b>({humanFileSize(flx.size)})</b></p>
        </div>);
      });
      data.valuedata.v.forEach(function (flx, dif) {
        let sub_ = flx.name.substring(0, 3), num_ = sub_.replace(/[^0-9.]\.+/g, ""), n_o = dif + 1, d_nama_;
        if (parseInt(num_) > 0) { d_nama_ = flx.name.replace(num_, ""); } else { d_nama_ = flx.name; }
        filesabstrak.push(<div className="file_xx" key={n_o} onClick={() => clickViewPdfabstrak(flx.realName)}>
          <i className="fas fa-file-pdf ml-3 pr-1" style={{ color: 'red', fontSize: '1.1rem' }}></i> {n_o}.
          <p className="click_file_d1">{d_nama_.trim()} <b>({humanFileSize(flx.size)})</b></p>
        </div>);
      });
      setrowFile(filesx);
      setrowFileabstrak(filesabstrak);
    }, []);

    async function clickZipFile(s) {
      s.preventDefault();
      let nomor = rowData.nomor_putusan.replaceAll("/", "_");
      setShowLoading(true);
      const resOpt = {
        url: `${server}/api/ebook/data_ebk`,
        method: 'POST',
        httpsAgent: Agent,
        responseType: 'blob',
        data: { 
          ket: 'Keenam', fl: nomor, gelar: `${rowData.jenis_putusan} ${nomor}_${rowData.tahun_putusan}`
        }
      };
      await axios.request(resOpt)
      .then(({ data }) => {
        const file_after_download = `${rowData.jenis_putusan} ${nomor}/${rowData.tahun_putusan}.zip`;
        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', file_after_download);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setShowLoading(false)
      });
    }

      function clickViewPdf(f) {
        setShowLoading(true)
        let nomor = rowData.nomor_putusan.replaceAll("/", "_");
        fetch(`${server}/api/hukumproduk/pdf?l=Putusanpengadilan&f=` + f + `&fl=` + nomor)
          .then(response => response.blob())
          .then(blob => URL.createObjectURL(blob), setShowLoading(false))
          .then(url => window.open(url, '_blank', 'noopener,noreferrer'))
          .catch(error => console.log(error));
      }

      function clickViewPdfabstrak(f) {
        setShowLoading(true)
        let nomor = rowData.nomor_putusan.replaceAll("/", "_");
        fetch(`${server}/api/hukumproduk/pdf?l=Abstrak&f=` + f + `&fl=` + nomor)
          .then(response => response.blob())
          .then(blob => URL.createObjectURL(blob), setShowLoading(false))
          .then(url => window.open(url, '_blank', 'noopener,noreferrer'))
          .catch(error => console.log(error));
      }

      function clickDetailEvent(j, n, t, tt) {
          let noSlash = n.split('/').join('+');
          let glr = tt.toUpperCase().split(' ').join('+').split('/').join('-');
          router.push('/detail/'+j+'/'+noSlash+'/'+t+'/'+encodeURI(glr), undefined, { shallow: true })
        }
      
  return (
    <div>{showLoading && (<CustomLoadingScreen />)}
    <Page title="Detail Putusan Pengadilam" description="Detail Putusan Pengadilan">
      <div className="container-fluid pl-2 pr-2 mt-5 mb-5 detailRecord">
        <section className="mb-6 row">
          <div className="col-md-9 mb-3">
          <div className="card card-cascade narrower mb-3 d_j_f0 scrollHor mt-5">
          <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
              <h6 className="h6-responsive mb-0 pl-2">Putusan Pengadilan</h6>
            </div>
            <div className="row card-body pt-3 pb-3 mr-1 ml-0 pr-0 pl-0">
            <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">TIPE DOKUMEN</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">{rowData.jenis_putusan.toUpperCase()}</div>
              </div>
            <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">JUDUL</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">{rowData.judul_putusan.toUpperCase()}</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">T.E.U Badan/Pengarang</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">{rowData.teu}</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">Nomor Peraturan</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">{rowData.nomor_putusan}</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">Jenis Peradilan</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">{rowData.jns_peradilan.toUpperCase()}</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">Singkatan Jenis Peradilan</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">{rowData.singkatan_jns.toUpperCase()}</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">Tempat Penetapan</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">{rowData.tempat}</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
                {rowData.tanggal_dibacakan !== '0000-00-00' && rowData.tanggal_dibacakan !== null ? (
                  <div>
                    <div className="ket_judldata2">Tanggal-Bulan-Tahun</div>
                    <div className="ket_dots2">:</div>
                    <div className="ket_isidata2">- Dibacakan {moment(rowData.tanggal_dibacakan).format('LL')}</div>
                  </div>
                ) : (
                  <div>
                    <div className="ket_judldata2"></div>
                    <div className="ket_dots2">:</div>
                    <div className="ket_isidata2">-</div>
                  </div>
                )}
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">Sumber</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">{rowData.sumber}</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">Subjek</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">{rowData.subjek}</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">Status</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">{rowData.status}</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">Bahasa</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">{rowData.bahasa}</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">Lokasi</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">{rowData.lokasi}</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">Bidang Hukum</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">Tata Negara</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">Lampiran</div>
              <div className="ket_dots">:</div>
              <div className="ket_isidata">-</div>
              </div>
              <div className="col-md-12 pl-3 pr-1">
              <div className="ket_judldata">Terkait</div>
              <div className="ket_dots">:</div>
              {undefined !== rowTerkait && 0 < rowTerkait.length ? rowTerkait.map( (d, k) => {
              return (
                <div className="isTeerkait" key={d.idperaturan} onClick={() => clickDetailEvent(d.jns, d.no_peraturan, d.tahun, d.tentang)}>
                  
                  <div className="ket_isidata2">{d.jns} {d.no_peraturan.toUpperCase()}/{d.tahun}</div>
                </div>
              ) 
              }) : (
                <div className="ket_isidata">-</div>
              )}
              </div>
              <div className="col-md-12 pl-3 pr-1 text-right">
                            <TwitterShareButton
                            url={`${server}${router.asPath}`}
                            title={`${rowData.jenis_putusan} ${rowData.nomor_putusan}/${rowData.tahun_putusan} Tentang ${rowData.judul_putusan}`}
                            >
                            <TwitterIcon size={32} round />
                          </TwitterShareButton>
                            <FacebookShareButton
                            url={`${server}${router.asPath}`}
                            quote={`${rowData.jenis_putusan} ${rowData.nomor_putusan}/${rowData.tahun_putusan} Tentang ${rowData.judul_putusan}`}
                            >
                            <FacebookIcon size={32} round />
                          </FacebookShareButton>
                          <TelegramShareButton
                            url={`${server}${router.asPath}`}
                            title={`${rowData.jenis_putusan} ${rowData.nomor_putusan}/${rowData.tahun_putusan} Tentang ${rowData.judul_putusan}`}
                          >
                            <TelegramIcon size={32} round />
                          </TelegramShareButton>
                          <WhatsappShareButton
                            url={`${server}${router.asPath}`}
                            title={`${rowData.jenis_putusan} ${rowData.nomor_putusan}/${rowData.tahun_putusan} Tentang ${rowData.judul_putusan}`}
                            separator=":: "
                          >
                            <WhatsappIcon size={32} round />
                          </WhatsappShareButton>
                          </div>
            </div>
          </div>
          </div>
          <div className="col-md-3 mb-3">
          {data.valuedata.file.length > 0 ? (
            <div className="card card-cascade narrower mb-3 d_j_f scrollHor mt-5">
              <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
                <h6 className="h6-responsive mb-0 pl-2">File Putusan</h6>
              </div>
              <div className="row card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-0 nano">
              <div className="nano-content">
                <div className="pl-3 col-md-12">
                  <div style={{ width: '5.5rem', float: 'left' }}>Jumlah File</div>
                  <div style={{ width: '1rem', float: 'left', 'fontWeight': 'bold' }}>:</div>
                  <div>{data.valuedata.file.length}</div>
                </div>
                <div className="pl-3 col-md-12">
                  <div className="pl-4">
                    {rowFile}
                  </div>
                </div>
                <div className="pl-3 col-md-12">
                  <div style={{ width: '5.5rem', float: 'left' }}>Unduh File</div>
                  <div style={{ width: '1rem', float: 'left', 'fontWeight': 'bold' }}>:</div>
                  <div><i className="d-i_rar fas fa-file-archive ml-0 tooltipx" data-original-title="Unduh Semua File" onClick={clickZipFile}></i></div>
                </div>
              </div>
              </div>
            </div>
          ) : (
            <div className="card card-cascade narrower mb-3 d_j_f scrollHor mt-5">
              <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
                <h6 className="h6-responsive mb-0 pl-2">File Putusan</h6>
              </div>
              <div className="row card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-0 nano">
              <div className="nano-content">
                <div className="pl-3 col-md-12">
                  <div style={{ width: '5.5rem', float: 'left' }}>Jumlah File</div>
                  <div style={{ width: '1rem', float: 'left', 'fontWeight': 'bold' }}>:</div>
                  <div>0</div>
                </div>
                <div className="pl-3 col-md-12">
                  <div className="pl-4">
                    {rowFile}
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}
          <div className="card card-cascade narrower mb-3 d_j_f scrollHor mt-5">
              <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
                <h6 className="h6-responsive mb-0 pl-2">Amar Putusan</h6>
              </div>
              <div className="row card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-0 nano">
              <p>{rowData.amar_putusan}</p>
              </div>
            </div>
            <div className="card card-cascade narrower mb-3 d_j_f scrollHor mt-5">
              <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
                <h6 className="h6-responsive mb-0 pl-2">Abstrak</h6>
              </div>
              <div className="row card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-0 nano">
              {rowFileabstrak}
              </div>
            </div>
          </div>
        </section>
      </div>
      </Page>
    </div>
  );
}

  export async function akukStatus(data) {
    let j_dt;
    if(data == null) {j_dt = ''} else {j_dt = data}
    if (typeof j_dt === 'string') {
      j_dt = j_dt.split(',');
    }
    const terkaitData = [];
    for (let item of j_dt) {terkaitData.push(item)}
    const resOpt = {
        dt: terkaitData 
      }
    const response = await axiosInstance.post('/api/putusan/dataterkait', resOpt);
    if(response.status === 500) {
      return { result: ''}
    } else {
      const resx = await response.data
      return { result: resx}
    }
  }

    function humanFileSize(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'Kb', 'Mb', 'Gb', 'Tb'][i];
    }

  export async function getServerSideProps(context) {
    const { query } = context;
    let hdl = query.q.split('/')
    let jnx = hdl[0].split('+').join(' ')
    let nox = hdl[1].split('+').join('/')

    const resOpt = { jns: jnx, no: nox, thn: hdl[2], k: 'isi'}
    const response = await axiosInstance.post('/api/putusan/putusan_p', resOpt);
    const intiData = await response.data;
    if (intiData.data === undefined) {
      return {
        redirect: {
          destination: '/putusan-pengadilan/MA',
          permanent: false,
        }
      }
    }
    const terk = intiData.data[0].terkait.replaceAll("'", "").split(',');
    const [valuedata, d_status] = await Promise.all([
        intiData,
        akukStatus(terk)
      ]);
      return { props: { data: { valuedata, d_status } } };
    }

export default Datetailputusan;