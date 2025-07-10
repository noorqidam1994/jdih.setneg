import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import Page from "../components/page";
import CustomLoadingScreen from "../components/Loading-screeen";
import axiosInstance from "../lib/axiosInstance";
import axios from "axios";
import https from "https";
import { server } from "../config";
const Agent = new https.Agent({
  rejectUnauthorized: false,
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
} from "next-share";

function Datetailartikel({ data }) {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [rowData, setRowData] = useState(data.valuedata.data[0]);
  const [rowFile, setrowFile] = useState();
  let idLocale = require("moment/locale/id");
  moment.updateLocale("id", idLocale);

  useEffect(() => {
    const filesx = [];
    data.valuedata.file.forEach(function (flx, dif) {
      let sub_ = flx.name.substring(0, 3),
        num_ = sub_.replace(/[^0-9.]\.+/g, ""),
        n_o = dif + 1,
        d_nama_;
      if (parseInt(num_) > 0) {
        d_nama_ = flx.name.replace(num_, "");
      } else {
        d_nama_ = flx.name;
      }
      filesx.push(
        <div
          className="file_xx"
          key={n_o}
          onClick={() => clickViewPdf(flx.realName)}
        >
          <i
            className="fas fa-file-pdf ml-3 pr-1"
            style={{ color: "red", fontSize: "1.1rem" }}
          ></i>{" "}
          {n_o}.
          <p className="click_file_d1">
            {d_nama_.trim()} <b>({humanFileSize(flx.size)})</b>
          </p>
        </div>
      );
    });
    setrowFile(filesx);
  }, []);

  async function clickZipFile(s) {
    s.preventDefault();
    let nomor = rowData.idartikelhukum.replaceAll("/", "_");
    setShowLoading(true);
    const resOpt = {
      url: `${server}/api/ebook/data_ebk`,
      method: "POST",
      httpsAgent: Agent,
      responseType: "blob",
      data: {
        ket: "Kedelapan",
        fl: nomor,
        gelar: `${rowData.jenis_artikel} ${nomor}_${rowData.tahun_terbit}`,
      },
    };
    await axios.request(resOpt).then(({ data }) => {
      const file_after_download = `${rowData.jenis_artikel} ${rowData.teu_artikel}/${rowData.tahun_terbit}.zip`;
      const downloadUrl = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", file_after_download);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setShowLoading(false);
    });
  }

  function clickViewPdf(f) {
    setShowLoading(true);
    let nomor = rowData.idartikelhukum.replaceAll("/", "_");
    fetch(
      `${server}/api/hukumproduk/pdf?l=Artikelhukum&f=` + f + `&fl=` + nomor
    )
      .then((response) => response.blob())
      .then((blob) => URL.createObjectURL(blob), setShowLoading(false))
      .then((url) => window.open(url, "_blank", "noopener,noreferrer"))
      .catch((error) => console.log(error));
  }

  return (
    <div>
      {showLoading && <CustomLoadingScreen />}
      <Page title="Detail Artikel Hukum" description="Detail Artikel Hukum">
        <div className="container-fluid pl-2 pr-2 mt-5 mb-5 detailRecord">
          <section className="mb-6 row">
            <div className="col-md-9 mb-3">
              <div className="card card-cascade narrower mb-3 d_j_f0 scrollHor mt-5">
                <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
                  <h6 className="h6-responsive mb-0 pl-2">
                    {rowData.jenis_artikel}
                  </h6>
                </div>
                <div className="row card-body pt-3 pb-3 mr-1 ml-0 pr-0 pl-0">
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">TIPE DOKUMEN</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">
                      {rowData.jenis_artikel.toUpperCase()}
                    </div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">JUDUL</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">
                      {rowData.judul.toUpperCase()}
                    </div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">T.E.U Orang/Pengarang</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">{rowData.teu}</div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Tempat Terbit</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">
                      {rowData.tempat_terbit.toUpperCase()}
                    </div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata2">Tahun Terbit</div>
                    <div className="ket_dots2">:</div>
                    <div className="ket_isidata2">{rowData.tahun_terbit}</div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Sumber</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">{rowData.sumber_artikel}</div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Subjek</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">{rowData.subjek_artikel}</div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Bahasa</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">{rowData.bahasa_artikel}</div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Bidang Hukum</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">{rowData.bidang_artikel}</div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Lokasi</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">{rowData.lokasi_artikel}</div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Lampiran</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">
                      {data.valuedata.file.length > 0 ? (
                        <span>{rowFile}</span>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1 text-right">
                    <TwitterShareButton
                      url={`${server}${router.asPath}`}
                      title={`${rowData.jenis_artikel} ${rowData.judul}/${rowData.tahun_terbit}`}
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <FacebookShareButton
                      url={`${server}${router.asPath}`}
                      quote={`${rowData.jenis_artikel} ${rowData.judul}/${rowData.tahun_terbit}`}
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TelegramShareButton
                      url={`${server}${router.asPath}`}
                      title={`${rowData.jenis_artikel} ${rowData.judul}/${rowData.tahun_terbit}`}
                    >
                      <TelegramIcon size={32} round />
                    </TelegramShareButton>
                    <WhatsappShareButton
                      url={`${server}${router.asPath}`}
                      title={`${rowData.jenis_artikel} ${rowData.judul}/${rowData.tahun_terbit}`}
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
                    <h6 className="h6-responsive mb-0 pl-2">File</h6>
                  </div>
                  <div className="row card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-0 nano">
                    <div className="nano-content">
                      <div className="pl-3 col-md-12">
                        <div style={{ width: "5.5rem", float: "left" }}>
                          Jumlah File
                        </div>
                        <div
                          style={{
                            width: "1rem",
                            float: "left",
                            fontWeight: "bold",
                          }}
                        >
                          :
                        </div>
                        <div>{data.valuedata.file.length}</div>
                      </div>
                      <div className="pl-3 col-md-12">
                        <div className="pl-4">{rowFile}</div>
                      </div>
                      <div className="pl-3 col-md-12">
                        <div style={{ width: "5.5rem", float: "left" }}>
                          Unduh File
                        </div>
                        <div
                          style={{
                            width: "1rem",
                            float: "left",
                            fontWeight: "bold",
                          }}
                        >
                          :
                        </div>
                        <div>
                          <i
                            className="d-i_rar fas fa-file-archive ml-0 tooltipx"
                            data-original-title="Unduh Semua File"
                            onClick={clickZipFile}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card card-cascade narrower mb-3 d_j_f scrollHor mt-5">
                  <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
                    <h6 className="h6-responsive mb-0 pl-2">File</h6>
                  </div>
                  <div className="row card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-0 nano">
                    <div className="nano-content">
                      <div className="pl-3 col-md-12">
                        <div style={{ width: "5.5rem", float: "left" }}>
                          Jumlah File
                        </div>
                        <div
                          style={{
                            width: "1rem",
                            float: "left",
                            fontWeight: "bold",
                          }}
                        >
                          :
                        </div>
                        <div>0</div>
                      </div>
                      <div className="pl-3 col-md-12">
                        <div className="pl-4">{rowFile}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="card card-cascade narrower mb-3 d_j_f scrollHor mt-5">
                <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
                  <h6 className="h6-responsive mb-0 pl-2">Status</h6>
                </div>
                <div className="row card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-0 nano">
                  <p>{rowData.status_artikel}</p>
                </div>
              </div>
              <div className="card card-cascade narrower mb-3 d_j_f scrollHor mt-5">
                <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
                  <h6 className="h6-responsive mb-0 pl-2">Lokasi</h6>
                </div>
                <div className="row card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-0 nano">
                  <p>{rowData.lokasi_artikel}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Page>
    </div>
  );
}

function humanFileSize(size) {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    " " +
    ["B", "Kb", "Mb", "Gb", "Tb"][i]
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  let hdl = query.q.split("/");
  let judulj = hdl[1].split("+").join(" ");
  let judul = judulj.split("_").join("/");
  let jnx = hdl[0].split("+").join(" ");
  let thn = hdl[2];

  const resOpt = { jns: jnx, jdl: judul, thn: thn, k: "isi" };
  const response = await axiosInstance.post(
    "/api/artikelhukum/artikelall",
    resOpt
  );
  const intiData = await response.data;
  if (intiData.data === undefined) {
    return {
      redirect: {
        destination: "/artikel/All",
        permanent: false,
      },
    };
  }
  const [valuedata] = await Promise.all([intiData]);
  return { props: { data: { valuedata } } };
}

export default Datetailartikel;
