import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Page from "../components/page";
import Pagination from "react-js-pagination";
import cookiee from "js-cookie";
// Import cookie only on server side
let cookie;
if (typeof window === 'undefined') {
  cookie = require('cookie');
}
import axiosInstance from "../lib/axiosInstance";

const Putusanpengadilan = ({ data }) => {
  const router = useRouter();
  let lctx = router.asPath.slice(1).split("/");
  const inputVsearch = data.srchx;
  const [listThnCariArray, setlistThnCariArray] = useState([]);
  const [dvaluedata] = useState(data.valuedata.result.data);
  const [djenis] = useState(data.dataJenis);
  const [dtahun, setdtahun] = useState(data.dataTahun);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecord] = useState(data.valuedata.result.jml);
  const [showMethn, setShowMethn] = useState(true);
  const [showSepokthn, setShowSepokthn] = useState(false);
  const [showlistThnCari, setshowlistThnCari] = useState(false);

  function clickDetailEvent(j, n, t) {
    let noSlash = n.split("/").join("+");
    let noSlashj = j.split(" ").join("+");
    router.push(
      "/detailputusan/" + noSlashj + "/" + noSlash + "/" + t,
      undefined,
      { shallow: true }
    );
  }

  useEffect(() => {
    setCurrentPage(data.pageptsx);
    if (lctx[2] !== undefined) {
      $(".s-btn-close").show();
    } else {
      $(".s-btn-close").hide();
    }
    $("#sepoktentang").on("change", function () {
      if ($(this).val() === "") {
        cookiee.set("akuksearch", "");
      }
    });
    $.each(data.jnsxx, function (i, v) {
      $("#listJns")
        .find("input[type=checkbox][value='" + v + "']")
        .prop("checked", true);
    });
    $.each(data.thnxx, function (ix, vx) {
      let crThnx = $("#listThn").find(
        "input[type=checkbox][value='" + vx + "']"
      );
      if (crThnx.length > 0) {
        $("#listThn")
          .find("input[type=checkbox][value='" + vx + "']")
          .prop("checked", true);
      }
    });
  }, []);

  const handleClickInsideMenu = (e) => {
    $(".drawer-list").addClass("jdihDrawer");
    $(".drawer-full-active").addClass("jdihDrawer");
    $("#filter_move").detach().appendTo(".drawer-list");
    $(".leftFilter").hide();
    $(".full-balakni")
      .removeClass("col-lg-9 col-md-12")
      .addClass("col-lg-12 col-md-12");
  };
  const handleClickOusideMenu = (e) => {
    $(".drawer-list").removeClass("jdihDrawer");
    $(".drawer-full-active").removeClass("jdihDrawer");
    $("#filter_move").detach().appendTo(".leftFilter");
    $(".leftFilter").show();
    $(".full-balakni")
      .removeClass("col-lg-12 col-md-12")
      .addClass("col-lg-9 col-md-12");
  };

  const handleClickClose = (cls) => {
    $("#sepoktentang").val("");
    $(".s-btn-close").hide();
    cookiee.set("akuksearch", "", { secure: true, expires: 7, path: "/" });
    router.push("/putusan-pengadilan/All/", undefined, { shallow: true });
  };

  const handleClickbtnSearch = (csp) => {
    let link = $("#sepoktentang")
      .val()
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join("+")
      .split("/")
      .join("-");
    cookiee.set("pagex", 1, { secure: true, expires: 7, path: "/" });
    cookiee.set("akuksearch", link, { secure: true, expires: 7, path: "/" });
    router.push(
      "/putusan-pengadilan/" + lctx[1] + "/" + encodeURI(link),
      undefined,
      { shallow: true }
    );
  };

  const onKeyPressSearch = (x) => {
    let link = x.target.value
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join("+")
      .split("/")
      .join("-");
    if (x.keyCode === 13) {
      cookiee.set("pagex", 1, { secure: true, expires: 7, path: "/" });
      cookiee.set("akuksearch", link, { secure: true, expires: 7, path: "/" });
      router.push(
        "/putusan-pengadilan/" + lctx[1] + "/" + encodeURI(link),
        undefined,
        { shallow: true }
      );
      x.preventDefault();
    }
    if (x.target.value === "") {
      $(".s-btn-close").hide();
    } else {
      $(".s-btn-close").show();
    }
  };

  const handleClicklbhtahun = async (x) => {
    if (dtahun.length > 11 || dtahun.length >= data.jml_t) {
      setShowSepokthn(true);
      const jnscrfield = document.querySelector(`input[id=sepoktahun]`);
      jnscrfield.focus();
    } else {
      const akukThn = await getTahun(6);
      setdtahun(akukThn.result.data);
      if (akukThn.result.data.length >= akukThn.result.jml) {
        setShowMethn(false);
      } else {
        setShowMethn(true);
      }
    }
  };

  const handleChangetahun = async (x) => {
    const jsonD = await cariTahun(x.target.value);
    let array = [];
    setshowlistThnCari(true);
    if (jsonD.result.length > 0) {
      $.each(jsonD.result, function (i, v) {
        let chk_c = $("#listThn")
          .find("input[type=checkbox][value='" + v.tahun + "']")
          .is(":checked");
        array.push(
          <label
            className="option_item"
            key={v.tahun}
            id={v.tahun}
            onChange={handleClickthnCari}
          >
            <input
              type="checkbox"
              className="checkbox"
              name="thn_x"
              value={v.tahun}
              defaultChecked={chk_c ? true : false}
            />
            <div className="option_inner _jdih">
              <div className="tickmark"></div>
              <div className="name glrthn">{v.tahun}</div>
            </div>
          </label>
        );
      });
      setlistThnCariArray(array);
    }
    if (x.target.value === "") {
      setlistThnCariArray([]);
      setshowlistThnCari(false);
    }
  };

  const handleClickthnCari = (e) => {
    let prn = e.currentTarget.getAttribute("id");
    let $clone = $("#listThnCari label#" + prn).clone();
    if (
      e.target.checked &&
      $("#listThn #" + prn) !== $("#listThnCari label#" + prn)
    ) {
      $("#listThn #" + prn).remove();
      $("#listThn").prepend($clone);
      $("#listThn .checkbox").attr("name", "thn[]");
    } else {
      $("#listThn #" + prn + " .checkbox").prop("checked", false);
    }
  };

  const handleCloseTahun = (t) => {
    $("#sepoktahun").val("");
    setShowSepokthn(false);
    setshowlistThnCari(false);
  };

  const hendleBtnTerapkan = (trapkan) => {
    const markedCheckboxJenis = document.getElementsByName("jns[]");
    const markedCheckboxTahun = document.getElementsByName("thn[]");
    let arrJns = [],
      arrThn = [],
      arrJenisUnyin = [],
      arrTahunUnyin = [];
    for (var i = 0; i < markedCheckboxJenis.length; i++) {
      arrJenisUnyin.push(markedCheckboxJenis[i].value);
      if (markedCheckboxJenis[i].checked === true) {
        arrJns.push(markedCheckboxJenis[i].value);
      }
    }
    for (var i = 0; i < markedCheckboxTahun.length; i++) {
      arrTahunUnyin.push(markedCheckboxTahun[i].value);
      if (markedCheckboxTahun[i].checked === true) {
        arrThn.push(markedCheckboxTahun[i].value);
      }
    }
    cookiee.set("inji_jns", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("jns_x", arrJns.join(","), {
      secure: true,
      expires: 7,
      path: "/",
    });
    cookiee.set("thn_x", arrThn.join(","), {
      secure: true,
      expires: 7,
      path: "/",
    });
    cookiee.set("jns_unyin", arrJenisUnyin.join(","), {
      secure: true,
      expires: 7,
      path: "/",
    });
    cookiee.set("thn_unyin", arrTahunUnyin.join(","), {
      secure: true,
      expires: 7,
      path: "/",
    });
    cookiee.set("totalDjenis", data.jml_j, {
      secure: true,
      expires: 7,
      path: "/",
    });
    cookiee.set("totalDtahun", data.jml_t, {
      secure: true,
      expires: 7,
      path: "/",
    });
    cookiee.set("pagex", 1);
    let akuksearch;
    if (lctx[2] === undefined || lctx[2] === "") {
      akuksearch = "";
    } else {
      akuksearch = "/" + lctx[2];
    }
    router.push("/putusan-pengadilan/" + lctx[1] + akuksearch, undefined, {
      shallow: true,
    });
  };

  const hendleBtnReset = (rset) => {
    cookiee.set("inji_jns", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("jns_x", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("thn_x", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("jns_unyin", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("thn_unyin", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("totalDjenis", data.jml_j, {
      secure: true,
      expires: 7,
      path: "/",
    });
    cookiee.set("totalDtahun", data.jml_t, {
      secure: true,
      expires: 7,
      path: "/",
    });
    cookiee.set("pagex", 1);
    let akuksearch;
    if (lctx[2] === undefined || lctx[2] === "") {
      akuksearch = "";
    } else {
      akuksearch = "/" + lctx[2];
    }
    router.push("/putusan-pengadilan/" + lctx[1] + akuksearch, undefined, {
      shallow: true,
    });
  };

  const handlePageChange = async (pageNumber) => {
    let akuksearch;
    if (lctx[2] === undefined || lctx[2] === "") {
      akuksearch = "";
    } else {
      akuksearch = "/" + lctx[2];
    }
    setCurrentPage(pageNumber);
    cookiee.set("pagex", pageNumber, { secure: true, expires: 7, path: "/" });
    router.push("/putusan-pengadilan/" + lctx[1] + akuksearch, undefined, {
      shallow: true,
    });
  };

  return (
    <Page title="Putusan Pengadilan" description="Putusan Pengadilan">
      <div className="loading" style={{ display: "none" }}>
        Loading...
      </div>
      <section className="isi_data_x">
        <div className="row ml-0 mr-0 pt-4 mb-5">
          <div className="col-lg-9 col-md-12 pl-0 pr-0 full-balakni">
            <div className="backrMenuSearch">
              <div
                className="search-box sepok_ats"
                style={{ padding: "0 3.6rem 0 1rem !important" }}
              >
                <form
                  className="search-form"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    className="form-control"
                    id="sepoktentang"
                    onKeyDown={onKeyPressSearch}
                    defaultValue={inputVsearch}
                    placeholder="Cari data produk hukum..."
                    type="text"
                    autoComplete="off"
                  />
                  <button
                    className="search-btn s-btn-close"
                    onClick={handleClickClose}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <button className="search-btn" onClick={handleClickbtnSearch}>
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </form>
              </div>
            </div>
            <div
              id="isiRecord"
              className="row view-group ml-0 mr-0 isidataRecord"
            >
              {undefined !== dvaluedata && 0 < dvaluedata.length ? (
                dvaluedata.map((d, k) => {
                  return (
                    <section
                      className="dataLoad col-12 col-md-12 mt-3"
                      key={d.idputusan}
                      id={d.idputusan}
                    >
                      <div className="card listbg">
                        <div className="row">
                          <div className="col-xl-12 col-md-12 mb-0">
                            <div className="card-body pt-0 pr-0 pl-0 cardbodystyle">
                              <div className="row col-md-12 pl-1 pr-1 pt-1 pb-1 ml-0 mr-0">
                                <div className="item list-group-item mb-0">
                                  <div
                                    className="caption"
                                    onClick={() =>
                                      clickDetailEvent(
                                        d.jenis_putusan,
                                        d.nomor_putusan,
                                        d.tahun_putusan
                                      )
                                    }
                                  >
                                    <p
                                      className="group inner list-group-item-text pstyle d1"
                                      style={{ fontSize: "large" }}
                                    >
                                      {d.jenis_putusan.toUpperCase()} NOMOR{" "}
                                      {d.nomor_putusan} TAHUN {d.tahun_putusan}
                                    </p>
                                    <p className="group inner list-group-item-text d4">
                                      {d.judul_putusan.toLowerCase()}
                                    </p>
                                    <p
                                      className="group inner list-group-item-text d5"
                                      style={{
                                        position: "absolute",
                                        bottom: ".3em",
                                        paddingRight: ".5rem !important",
                                        right: ".1rem",
                                      }}
                                    >
                                      <button
                                        className="btn-blue-grey waves-effect waves-light btn btn-lg"
                                        type="submit"
                                      >
                                        DETAIL
                                      </button>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                })
              ) : (
                <h5 className="mt-4 col-md-12 text-center">
                  Data Yang Anda Cari Tidak Ada...
                </h5>
              )}
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
          </div>

          <div className="col-lg-3 col-md-0 mt-3 leftFilter">
            <form id="filter_move" onSubmit={(e) => e.preventDefault()}>
              <input type="hidden" id="jml_j" />
              <input type="hidden" id="jml_t" />
              <div className="filter-jdih-header" id="h_jenis">
                Jenis Putusan
              </div>
              <div className="container pl-0 pr-0" id="listJns">
                {djenis &&
                  djenis.map((item) => (
                    <label
                      className="option_item"
                      key={item.jenis_putusan}
                      id={item.jenis_putusan}
                    >
                      <input
                        type="checkbox"
                        className="checkbox chckjenis"
                        name="jns[]"
                        value={item.jenis_putusan}
                      />
                      <div className="option_inner _jdih">
                        <div className="tickmark"></div>
                        <div className="name glrjns">{item.jenis_putusan}</div>
                      </div>
                    </label>
                  ))}
              </div>
              <div style={{ clear: "both" }}></div>
              <div className="filter-jdih-header" id="h_tahun">
                Tahun Putusan
              </div>
              <div
                id="spk_thn"
                style={{ display: showSepokthn ? "block" : "none" }}
              >
                <div className="md-form form-sm mt-0 mb-2 pr-0 pl-0 sepokDrawer">
                  <i
                    className="fas fa-search icn_cari"
                    aria-hidden="true"
                    suppressHydrationWarning
                  ></i>
                  <input
                    type="text"
                    id="sepoktahun"
                    onChange={handleChangetahun}
                    placeholder="Cari Tahun..."
                    className="search_boxtable"
                    autoComplete="off"
                  />
                  <i
                    className="fas fa-times close_cari"
                    suppressHydrationWarning
                    onClick={handleCloseTahun}
                  ></i>
                </div>
              </div>
              <div className="pl-0 pr-0" id="listThn">
                {dtahun &&
                  dtahun.map((item) => (
                    <label
                      className="option_item"
                      key={item.tahun_putusan}
                      id={item.tahun_putusan}
                    >
                      <input
                        type="checkbox"
                        className="checkbox chcktahun"
                        name="thn[]"
                        value={item.tahun_putusan}
                      />
                      <div className="option_inner _jdih">
                        <div className="tickmark"></div>
                        <div className="name glrthn">{item.tahun_putusan}</div>
                      </div>
                    </label>
                  ))}
              </div>
              <div
                className="container pl-0 pr-0"
                id="listThnCari"
                style={{ display: showlistThnCari ? "block" : "none" }}
              >
                {listThnCariArray.length ? (
                  listThnCariArray.map((axr, i) => {
                    return <div key={i * 2}>{axr}</div>;
                  })
                ) : (
                  <p className="pcarikosong">Tahun Yang Anda Cari Tidak Ada</p>
                )}
              </div>
              <div style={{ clear: "both" }}></div>
              <div
                className="filter-jdih-section__toggle"
                style={{ display: showMethn ? "block" : "none" }}
                id="liak_thn"
                onClick={handleClicklbhtahun}
              >
                Lihat Lebih <i className="fas fa-arrow-down"></i>
              </div>
              <div className="col-xl-12 col-md-12 mt-3 text-center">
                <button
                  className="btn-blue-grey waves-effect waves-light btn btn-md"
                  type="reset"
                  onClick={hendleBtnReset}
                >
                  Atur Ulang
                </button>
                <button
                  className="btn-dark-green waves-effect waves-light btn btn-md"
                  onClick={hendleBtnTerapkan}
                >
                  Terapkan
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="drawer-list"></section>
      <div className="drawer-full-active" onClick={handleClickOusideMenu}></div>
      <div>
        <ul
          className="sticky-container showhideMenuLeft"
          style={{ display: "none" }}
        >
          <li onClick={handleClickInsideMenu}>
            <p className="filterperaturan">
              <span>Filter</span>
              <i className="fas fa-filter" style={{ paddingLeft: ".2rem" }}></i>
            </p>
          </li>
        </ul>
      </div>
    </Page>
  );
};

export async function getJenis() {
  const response = await axiosInstance.get("/api/putusan/jns");
  if (response.status === 500) {
    return { result: { data: "", jml: "" } };
  } else {
    const resx = response.data;
    return { result: resx };
  }
}

export async function getTahun(Lmt) {
  const response = await axiosInstance.get("/api/putusan/thn?lmt=" + Lmt);
  if (response.status === 500) {
    return { result: { data: "", jml: "" } };
  } else {
    return { result: await response.data };
  }
}

export async function cariTahun(qu) {
  const response = await axiosInstance.get("/api/putusan/thncari?vl=" + qu);
  if (response.status === 500) {
    return { result: [] };
  } else {
    return { result: await response.data };
  }
}

export async function getValuedata(srh, jns, thn, crnPg, lmtDt) {
  let tentang = srh,
    length = lmtDt,
    start = (crnPg - 1) * lmtDt;

  const resOpt = {
    tentang: tentang,
    jns: jns,
    thn: thn,
    length: length,
    start: start,
    k: "",
  };
  const res_p = await axiosInstance.post("/api/putusan/putusan_p", resOpt);
  if (res_p.status === 500) {
    return { result: { data: "", jml: "" } };
  } else {
    const resx = await res_p.data;
    return { result: resx };
  }
}

export async function getServerSideProps(context) {
  const { query } = context;
  let isiSearch, akukKhia;
  if (query.q === "All") {
    isiSearch = "";
    akukKhia = "";
  } else {
    let isiData = query.q.split("/");
    isiSearch = isiData[1].split("+").join(" ").split("#").join("");
    akukKhia = isiData[1].split("#").join("");
  }

  let jnsxx,
    thnxx,
    jnsxxPush = [],
    thnxxPush = [],
    jns_unyinx = [],
    thn_unyinx = [],
    totalDjenis,
    totalDtahun,
    pagexx;
  if (context.req && context.req.headers && context.req.headers.cookie && cookie) {
    const prse = cookie.parse(context.req.headers.cookie);
    if (prse.jns_x !== "" && prse.jns_x !== undefined) {
      const pchx = prse.jns_x.split(",");
      for (let jx = 0; jx < pchx.length; jx++) {
        jnsxxPush.push(pchx[jx]);
      }
      jnsxx = jnsxxPush;
    } else {
      jnsxx = "";
    }
    if (prse.thn_x !== "" && prse.thn_x !== undefined) {
      const pcht = prse.thn_x.split(",");
      for (let tx = 0; tx < pcht.length; tx++) {
        thnxxPush.push(pcht[tx]);
      }
      thnxx = thnxxPush;
    } else {
      thnxx = "";
    }
    if (prse.jns_unyin !== "" && prse.jns_unyin !== undefined) {
      const pchx_j = prse.jns_unyin.split(",");
      for (let ju = 0; ju < pchx_j.length; ju++) {
        jns_unyinx.push({ jenis_putusan: pchx_j[ju] });
      }
    } else {
      jns_unyinx.push("");
    }
    if (prse.thn_unyin !== "" && prse.thn_unyin !== undefined) {
      const pchx_t = prse.thn_unyin.split(",");
      for (let jt = 0; jt < pchx_t.length; jt++) {
        thn_unyinx.push({ tahun_putusan: pchx_t[jt] });
      }
    } else {
      thn_unyinx.push("");
    }
    totalDjenis = prse.totalDjenis;
    totalDtahun = prse.totalDtahun;
    if (prse.pagex !== "" && prse.pagex !== undefined) {
      pagexx = parseInt(prse.pagex);
    } else {
      pagexx = 1;
    }
  } else {
    jnsxx = "";
    thnxx = "";
    jns_unyinx = [""];
    thn_unyinx = [""];
    totalDjenis = 0;
    totalDtahun = 0;
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

  let dataJenis, jml_j, dataTahun, jml_t;
  if (jns_unyinx.length > 1) {
    dataJenis = jns_unyinx;
    jml_j = totalDjenis;
  } else {
    const dataJenisJml = await getJenis();
    dataJenis = dataJenisJml.result.data;
    jml_j = dataJenisJml.result.jml;
  }

  if (thn_unyinx.length > 1) {
    dataTahun = thn_unyinx;
    jml_t = totalDtahun;
  } else {
    const dataTahunJml = await getTahun(0);
    dataTahun = dataTahunJml.result.data;
    jml_t = dataTahunJml.result.jml;
  }

  if (dataJenis === undefined) {
    return {
      redirect: {
        destination: "/putusan-pengadilan/",
        permanent: false,
      },
    };
  }

  const [srchx, valuedata] = await Promise.all([
    isiSearch,
    getValuedata(akukKhia, jnsxx, thnxx, pagexx, 10),
  ]);
  return {
    props: {
      data: {
        srchx,
        valuedata,
        dataJenis,
        jml_j,
        dataTahun,
        jml_t,
        jnsxx,
        thnxx,
        pagexx,
      },
    },
  };
}

export default Putusanpengadilan;
