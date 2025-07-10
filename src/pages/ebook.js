import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Page from "../components/page";
import Pagination from "react-js-pagination";
import cookiee from "js-cookie";
// Import cookie only on server side
let cookie;
if (typeof window === "undefined") {
  cookie = require("cookie");
}
import axiosInstance from "../lib/axiosInstance";
import { server } from "../config";
import CustomLoadingScreen from "../components/Loading-screeen";

const Ebook = ({ data }) => {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [dvaluedata] = useState(data.valuedata.result.data);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecord] = useState(data.valuedata.result.jml);
  // const [flipbookOpen, setFlipbookOpen] = useState(false);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleClickView = async function (id, v, lht) {
    window.open(`${server}/api/ebook/pdf?fl=${id}&f=${v}`);
    // setFlipbookOpen(true)
    // book = await $('.ibolpdf .isiPdf').FlipBook({
    //   pdf: `${server}/api/ebook/pdf?fl=` + id + `&f=` + v,
    //   template: {
    //     html: '/flipbook/templates/default-book-view.html',
    //     links: [
    //       {
    //         rel: 'stylesheet',
    //         href: '/flipbook/css/font-awesome.min.css'
    //       }
    //     ],
    //     styles: [
    //       '/flipbook/css/short-white-book-view.css'
    //     ],
    //     links: [{
    //       rel: 'stylesheet',
    //       href: '/flipbook/css/font-awesome.min.css'
    //     }],
    //     script: '/flipbook/js/default-book-view.js'
    //   }
    // });

    const resOpt = {
      k: "Kedua",
      fl: id,
      isipdf: v,
      lht: lht,
    };
    const up = await axiosInstance.post("/api/ebook/listebook", resOpt);
    console.log(up.data);
    // refreshData();
  };

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    cookiee.set("pagex", pageNumber, { secure: true, expires: 7, path: "/" });
    router.push("/ebook", undefined, { shallow: true });
  };

  const handleClickDownload = async function (id, d) {
    setShowLoading(true);
    const resOpt2 = {
      ket: "Ketiga",
      fl: id,
      isipdf: "",
    };
    const resOpt = {
      ket: "Keempat",
      fl: id,
      isipdf: d,
    };
    await axiosInstance.post("/api/ebook/data_ebk", resOpt).then(({ data }) => {
      let idLocale = require("moment/locale/id");
      moment.updateLocale("id", idLocale);
      const hariini = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      const file_after_download = "Ebook_JDIH_Kemensetneg_" + hariini + ".zip";
      const downloadUrl = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", file_after_download);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setShowLoading(false);
    });
    await axiosInstance.post("/api/ebook/data_ebk", resOpt2);
    refreshData();
  };

  // function handleClose() {
  //   book.dispose();
  //   setFlipbookOpen(false)
  // }

  return (
    <div>
      {showLoading && <CustomLoadingScreen />}
      <Page title="E-book">
        {/* <div className="ibolpdf" style={{display: flipbookOpen?"block":"none"}}>
      <div className="ibolpdfAts2" onClick={handleClose}><svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#FFFFFF"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></div>
      <div className="isiPdf"></div>
      </div> */}
        <section className="awlAtsdibahbar pt-4">
          <div className="card card-cascade narrower">
            <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
              <h5 className="h5-responsive mb-0 pl-2">
                E-book JDIH Kemensetneg
              </h5>
            </div>
            <div className="card-body pt-0 pr-0 pl-0 pb-0">
              <div className="col-xl-12 col-lg-12 col-md-12 row"></div>
              <ul className="grid mt-5" id="listEbook">
                {dvaluedata.length ? (
                  dvaluedata.map((g, i) => (
                    <li key={i}>
                      <div className="grid_a">
                        <p
                          id="judul"
                          className="line-clamp line-clamp-6"
                          title={g.judul}
                        >
                          {g.judul}
                        </p>
                        <div className="ket">
                          <i className="fas fa-search" aria-hidden="true"></i>{" "}
                          {g.lihat} <span id="ket_jrk">Dilihat</span>
                        </div>
                        <div className="ket">
                          <i className="fas fa-download" aria-hidden="true"></i>{" "}
                          {g.unduh} <span id="ket_jrk">Diunduh</span>
                        </div>
                        <div className="ket">
                          <i className="fas fa-file" aria-hidden="true"></i>{" "}
                          {g.page} <span id="ket_jrk">Page</span>
                        </div>
                        <div
                          className="view_icn"
                          onClick={() =>
                            handleClickView(g.idebook, g.file_jj[0], g.lihat)
                          }
                        >
                          <i className="fas fa-file-pdf"></i> LIHAT
                        </div>
                      </div>
                      <div className="grid_b">
                        <div
                          className="view_icn"
                          onClick={() =>
                            handleClickDownload(g.id, g.file_jj[0])
                          }
                        >
                          <i className="fas fa-file-pdf"></i> UNDUH
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <h5 className="mt-4 col-md-12 text-center">
                    Data Ebook Kosong...
                  </h5>
                )}
              </ul>
            </div>
          </div>
          {undefined !== dvaluedata && 0 < dvaluedata.length && (
            <Pagination
              itemClass="page-item"
              linkClass="page-link waves-effect"
              activePage={currentPage}
              itemsCountPerPage={10}
              totalItemsCount={totalRecord}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            />
          )}
        </section>
      </Page>
    </div>
  );
};

export async function getValuedata(crnPg, lmtDt) {
  let length = lmtDt,
    start = (crnPg - 1) * lmtDt;

  const resOpt = {
    length: length,
    start: start,
    k: "",
  };
  const res_p = await axiosInstance.post("/api/ebook/listebook", resOpt);
  if (res_p.status === 500) {
    return { result: { data: "", jml: "" } };
  } else {
    const resx = await res_p.data;
    return { result: resx };
  }
}

export async function getServerSideProps(context) {
  let pagexx;
  if (
    context.req &&
    context.req.headers &&
    context.req.headers.cookie &&
    cookie
  ) {
    const prse = cookie.parse(context.req.headers.cookie);
    if (prse.pagex !== "" && prse.pagex !== undefined) {
      pagexx = parseInt(prse.pagex);
    } else {
      pagexx = 1;
    }
  } else {
    pagexx = 1;
    cookiee.set("jns_x", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("thn_x", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("stt", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("jns_unyin", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("thn_unyin", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("totalDjenis", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("totalDtahun", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("pagex", 1, { secure: true, expires: 7, path: "/" });
  }

  const [valuedata] = await Promise.all([getValuedata(pagexx, 10)]);
  return { props: { data: { valuedata, pagexx } } };
}

export default Ebook;
