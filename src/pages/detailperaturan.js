import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUserAgent } from "next-useragent";
import { db, collection, query, where, onSnapshot } from "../lib/clientApp";
import moment from "moment";
import Page from "../components/page";
import tabstatus from "../components/Tabstatus";
import tabterkait from "../components/Tabterkait";
import tabuji from "../components/Tabujimateril";
import cookiee from "js-cookie";
import cookie from "cookie";
import { addOnline } from "../components/addOnline";
import Pagination from "react-js-pagination";
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

function Dateailperaturan({ data }) {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [rowData, setRowData] = useState(data.isidata.row[0]);
  const [rowFile, setrowFile] = useState();
  const [statusOnline, setStatusOnline] = useState(data.jdOnline.row);
  const [validEmail, setvalidEmail] = useState("");
  const [btnSukaTidak, setbtnSukaTidak] = useState("");
  const [icnSukaTidak, seticnSukaTidak] = useState("");
  const [dTerkaitgroup, setTerkaitgroup] = useState(data.d_status.result.tk);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecord, setTotalRecords] = useState(1);
  const [myArraypohon, updatemyArraypohon] = useState([]);
  const [getGeo, setgetGeo] = useState(data.onlineArr[0]);
  let idLocale = require("moment/locale/id");
  moment.updateLocale("id", idLocale);

  const i_ats = [];
  const i_bwh = [];
  let dcs = data.d_status.result.dcs,
    dc = data.d_status.result.dc,
    dus = data.d_status.result.dus,
    du = data.d_status.result.du,
    mc = data.d_status.result.mc,
    me = data.d_status.result.me;
  if (data.d_status.result.dcs !== "") {
    i_bwh.push("DICABUT SEBAGIAN");
    i_ats.push(dcs);
  }
  if (data.d_status.result.dc !== "") {
    i_bwh.push("DICABUT");
    i_ats.push(dc);
  }
  if (data.d_status.result.dus !== "") {
    i_bwh.push("DIUBAH SEBAGIAN");
    i_ats.push(dus);
  }
  if (data.d_status.result.du !== "") {
    i_bwh.push("DIUBAH");
    i_ats.push(du);
  }
  if (data.mc_s !== "") {
    i_bwh.push("MENCABUT SEBAGIAN");
    i_ats.push(data.mc_s);
  }
  if (data.d_status.result.mc !== "") {
    i_bwh.push("MENCABUT");
    i_ats.push(mc);
  }
  if (data.me_s !== "") {
    i_bwh.push("MENGUBAH SEBAGIAN");
    i_ats.push(data.me_s);
  }
  if (data.d_status.result.me !== "") {
    i_bwh.push("MENGUBAH");
    i_ats.push(me);
  }
  const isitabsStatus = tabstatus({ dtatabs: { i_ats, i_bwh } });
  const isitabsTerkait = tabterkait({ dtatabs: dTerkaitgroup });
  const isitabsUjimateril = tabuji({ dtatabs: data.d_status.result.ujimateri });
  let tgl = moment(new Date()).format("YYYY-MM-DD");
  let jam = moment(new Date()).format("HH:mm:ss");
  let xxKey = data.isidata.row[0].idperaturan;
  const dwlviewRef = collection(db, "download_view");
  useEffect(() => {
    const q = query(
      dwlviewRef,
      where("idperaturan", "in", [`${xxKey}`]),
      where("keterangan", "==", "lihat"),
      where("saat_ini", "==", "1")
    );
  }, [xxKey, statusOnline]);

  const handleWindowClose = (e) => {
    e.preventDefault();
    addOnline({
      dataid: {
        idperaturan: xxKey,
        saat_ini: "0",
        keterangan: "lihat",
        user: "",
        tanggal: tgl,
        jam: jam,
        browser: getGeo.browserx,
        os: getGeo.osx,
        ip: getGeo.ipx,
        wilayah: getGeo.wilx,
        negara: getGeo.negx,
        userId: data.iDUser,
      },
    });
    return "";
  };

  // Helper function to initialize click handlers
  const initializeClickHandlers = () => {
    let label = document.querySelectorAll(
      ".swiper-wrapper .textarealabel-info"
    );
    for (let i = 0; i < label.length; i++) {
      let titx = label[i].getAttribute("data-original-title");
      let textx = label[i].innerText ? label[i].innerText.split(" ") : [];
      let nthn = textx[1] ? textx[1].split("/") : [];
      let idnya = label[i].id;
      let stt_n = label[i].getAttribute("status");
      let no_x, thn_x, noCheck, noCheck2, noCheck3, noCheck4;
      if (nthn.length > 2) {
        no_x = nthn[0] + "+" + nthn[1];
        thn_x = nthn[2];
      } else {
        no_x = nthn[0];
        thn_x = nthn[1];
      }

      data.d_status.result.mcs.forEach(function (itm, id) {
        if (idnya === itm) {
          noCheck = itm;
        }
      });
      data.d_status.result.mes.forEach(function (itm, id) {
        if (idnya === itm) {
          noCheck2 = itm;
        }
      });
      data.d_status.result.d_rub_s.forEach(function (itm, id) {
        if (idnya === itm) {
          noCheck3 = itm;
        }
      });
      data.d_status.result.d_cab_s.forEach(function (itm, id) {
        if (idnya === itm) {
          noCheck4 = itm;
        }
      });
      if (
        (noCheck === undefined &&
          noCheck2 === undefined &&
          noCheck3 === undefined &&
          noCheck4 === undefined &&
          stt_n !== "diluar") ||
        idnya === rowData.idperaturan
      ) {
        label[i].style.color = "#595968";
      }
      label[i].onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (
          noCheck !== undefined ||
          noCheck2 !== undefined ||
          noCheck3 !== undefined ||
          noCheck4 !== undefined ||
          stt_n === "diluar"
        ) {
          clickDetailEvent(textx[0], no_x, thn_x, titx);
        }
      };
    }
    
    let labelpohon = document.querySelectorAll(
      ".tree_label .textarealabel-info"
    );
    for (let i = 0; i < labelpohon.length; i++) {
      let textUrl = labelpohon[i].innerText ? labelpohon[i].innerText.split(" ") : [];
      let thn_n = textUrl[1] ? textUrl[1].split("/") : [];
      let id_n = labelpohon[i].id;
      let stt_n = labelpohon[i].getAttribute("status");
      let noCheck, noCheck2, noCheck3, noCheck4;
      data.d_status.result.mcs.forEach(function (itm, id) {
        if (id_n === itm) {
          noCheck = itm;
        }
      });
      data.d_status.result.mes.forEach(function (itm, id) {
        if (id_n === itm) {
          noCheck2 = itm;
        }
      });
      data.d_status.result.d_rub_s.forEach(function (itm, id) {
        if (id_n === itm) {
          noCheck3 = itm;
        }
      });
      data.d_status.result.d_cab_s.forEach(function (itm, id) {
        if (id_n === itm) {
          noCheck4 = itm;
        }
      });
      if (
        (noCheck === undefined &&
          noCheck2 === undefined &&
          noCheck3 === undefined &&
          noCheck4 === undefined &&
          stt_n !== "diluar") ||
        id_n === rowData.idperaturan
      ) {
        labelpohon[i].style.color = "#595968";
      }
      labelpohon[i].onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (
          (noCheck !== undefined &&
            noCheck2 !== undefined &&
            noCheck3 !== undefined &&
            noCheck4 !== undefined &&
            stt_n === "diluar") ||
          id_n !== rowData.idperaturan
        ) {
          getDataPohon(id_n);
        }
      };
    }
    
    var l_uji = document.getElementsByClassName("ujimaterilIsiFile");
    for (let i = 0; i < l_uji.length; i++) {
      let tit_u = l_uji[i].id;
      l_uji[i].onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        clickViewPdf(tit_u);
      };
    }
  };

  // Load jQuery and Bootstrap if not already loaded
  useEffect(() => {
    const loadScript = (src, id) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadCSS = (href, id) => {
      if (document.getElementById(id)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.id = id;
      document.head.appendChild(link);
    };

    // Load dependencies
    const loadDependencies = async () => {
      try {
        if (typeof window !== 'undefined' && typeof $ === 'undefined') {
          await loadScript('/js/jquery.min.js', 'jquery-script');
        }
        if (typeof window !== 'undefined' && (!window.bootstrap || !$.fn.tooltip)) {
          loadCSS('/css/bootstrap.min.css', 'bootstrap-css');
          await loadScript('/js/bootstrap.min.js', 'bootstrap-script');
        }
      } catch (error) {
        console.warn('Failed to load dependencies:', error);
      }
    };

    loadDependencies();
  }, []);

  useEffect(() => {
    const filesx = [];
    
    // Ensure jQuery is available before using it
    const initializeJQueryElements = () => {
      if (typeof $ !== 'undefined') {
        $("#sepoktentang").on("change", function () {
          if ($(this).val() === "") {
            cookiee.set("akuksearch", "");
          }
        });
      }
    };
    
    // Delay initialization to ensure scripts are loaded
    setTimeout(initializeJQueryElements, 500);
    data.isidata.file.forEach(function (flx, dif) {
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            clickViewPdf(flx.realName);
          }}
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
    
    // Initialize select options with jQuery if available
    setTimeout(() => {
      if (typeof $ !== 'undefined') {
        $('#p_lihan option[value="' + data.isiSelect + '"]').attr(
          "selected",
          "selected"
        );
      }
    }, 600);
    
    // Initialize click handlers and tooltips
    setTimeout(() => {
      initializeClickHandlers();
      // Initialize tooltips if jQuery and tooltip plugin are available
      if (typeof $ !== 'undefined' && $.fn.tooltip) {
        $(".tooltipx").tooltip();
      }
    }, 700);
    
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, [rowData]);

  async function clickDetailEvent(j, n, t, tt) {
    // Load related regulation data without page reload
    setShowLoading(true);
    
    try {
      const resOpt = {
        jns: j,
        no: n.split("+").join("/"),
        thn: t,
        k: "",
      };

      const response = await axiosInstance.post("/api/hukumproduk/detaildata", resOpt);
      const newData = await response.data;
      
      if (newData.row && newData.row[0]) {
        // Update the main regulation data
        setRowData(newData.row[0]);
        
        // Update files
        const filesx = [];
        newData.file.forEach(function (flx, dif) {
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

        // Get status data for the new regulation
        const statusData = await akukStatus(
          newData.row[0].idperaturan,
          newData.row[0].dicabut,
          newData.row[0].dicabut_sebagian,
          newData.row[0].diubah,
          newData.row[0].diubah_sebagian,
          newData.row[0].mencabut,
          newData.row[0].mencabutsebagian,
          newData.row[0].mengubah,
          newData.row[0].mengubahsebagian,
          newData.row[0].terkait
        );
        
        if (statusData.result && statusData.result.tk) {
          setTerkaitgroup(statusData.result.tk);
        }

        // Update URL without page reload using replace to avoid navigation stack issues
        const newUrl = "/detail/" + j + "/" + n + "/" + t + "/" + encodeURI(tt);
        window.history.replaceState(null, '', newUrl);
        
        setShowLoading(false);
        
        // Reinitialize click handlers and tooltips for new content
        setTimeout(() => {
          initializeClickHandlers();
          // Initialize tooltips if jQuery and tooltip plugin are available
          if (typeof $ !== 'undefined' && $.fn.tooltip) {
            $(".tooltipx").tooltip();
          }
        }, 200);
      }
    } catch (error) {
      console.error("Error loading related regulation:", error);
      setShowLoading(false);
      // Fallback to browser navigation if dynamic loading fails  
      window.location.href = "/detail/" + j + "/" + n + "/" + t + "/" + encodeURI(tt);
    }
  }

  function clickViewPdf(f) {
    setShowLoading(true);
    addOnline({
      dataid: {
        idperaturan: xxKey,
        saat_ini: "0",
        keterangan: "unduh",
        user: "",
        tanggal: tgl,
        jam: jam,
        browser: getGeo.browserx,
        os: getGeo.osx,
        ip: getGeo.ipx,
        wilayah: getGeo.wilx,
        negara: getGeo.negx,
        userId: data.iDUser,
      },
    }).then((result) => {
      let res = statusOnline.map(
        (obj) => result.row.find((o) => o.id === obj.id) || obj
      );
      setStatusOnline(res);
    });
    let pch = f.split(":");
    let id_k, fl_k;
    if (pch.length > 1) {
      fl_k = pch[0];
      id_k = rowData.idperaturan + pch[1];
    } else {
      fl_k = f;
      id_k = rowData.idperaturan;
    }

    fetch(`${server}/api/hukumproduk/pdf?l=uploads&f=` + fl_k + `&fl=` + id_k)
      .then((response) => response.blob())
      .then((blob) => URL.createObjectURL(blob), setShowLoading(false))
      .then((url) => window.open(url, "_blank", "noopener,noreferrer"))
      .catch((error) => console.log(error));
  }

  async function clickZipFile(s) {
    s.preventDefault();
    setShowLoading(true);
    const resOpt = {
      url: `${server}/api/ebook/data_ebk`,
      method: "POST",
      httpsAgent: Agent,
      responseType: "blob",
      data: {
        ket: "Kelima",
        fl: rowData.idperaturan,
        gelar: `${rowData.jns} ${rowData.no_peraturan}_${rowData.tahun}`,
      },
    };
    await axios.request(resOpt).then(({ data }) => {
      const file_after_download = `${rowData.jns} ${rowData.no_peraturan}/${rowData.tahun}.zip`;
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

  async function handleClickSukaTidak(x) {
    let ketST;
    if (x === "suka") {
      ketST = "Suka";
    } else {
      ketST = "Tidak Suka";
    }
    if (validEmail === "") {
      addOnline({
        dataid: {
          idperaturan: xxKey,
          saat_ini: "0",
          keterangan: x,
          user: $("#email").val(),
          tanggal: tgl,
          jam: jam,
          browser: getGeo.browserx,
          os: getGeo.osx,
          ip: getGeo.ipx,
          wilayah: getGeo.wilx,
          negara: getGeo.negx,
          userId: data.iDUser,
        },
      }).then((result) => {
        let res = statusOnline.map(
          (obj) => result.row.find((o) => o.id === obj.id) || obj
        );
        setStatusOnline(res);
        toastr.info("Respon berhasil diberikan", ketST);
      });
      $("#modalSukaTidak").modal("hide");
    }
  }

  const changeEmail = (e) => {
    e.preventDefault();
    let regEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (e.target.value === "" || !regEmail.test(e.target.value)) {
      setvalidEmail("Format Email Salah");
    } else {
      setvalidEmail("");
    }
  };

  function capitalizeCase(str) {
    if (!str) return '';
    var arr = str.split(" ");
    var t;
    var newt;
    var newarr = arr.map(function (d) {
      t = d.split("");
      newt = t.map(function (d, i) {
        if (i === 0) {
          return d.toUpperCase();
        }
        return d.toLowerCase();
      });
      return newt.join("");
    });
    var s = newarr.join(" ");
    return s;
  }

  async function getDataPohon(idpohon) {
    const resOpt = {
      idp: idpohon,
      k: "Pohon",
    };
    const response = await axiosInstance.post(
      "/api/hukumproduk/detaildata",
      resOpt
    );
    const intiData = await response.data;
    if (response.status === 200 && intiData.row[0] !== undefined) {
      const injiInti = intiData.row[0];
      const [sttData] = await Promise.all([
        akukStatus(
          injiInti.idperaturan,
          injiInti.dicabut,
          injiInti.dicabut_sebagian,
          injiInti.diubah,
          injiInti.diubah_sebagian,
          injiInti.mencabut,
          injiInti.mencabutsebagian,
          injiInti.mengubah,
          injiInti.mengubahsebagian,
          injiInti.terkait
        ),
      ]);
      let meng_sebagian, menc_sebagian;
      if (injiInti.mngbh_s !== "" && injiInti.mngbh_s !== null) {
        meng_sebagian =
          '<label class="option_item ketSebagian">' +
          '<div class="_jdih">' +
          '<div class="name"><p><i class="fas fa-star"></i> <span id="' +
          injiInti.idperaturan +
          '" data-original-title="' +
          injiInti.tentang +
          '" class="textarealabel-info tooltipx">' +
          injiInti.jns +
          " " +
          injiInti.no_peraturan.toUpperCase() +
          "/" +
          injiInti.tahun +
          "</span>" +
          "Mengubah Sebagian Dengan Ketentuan Sebagai Berikut:</p></div>" +
          "</div>" +
          '</label><div style="padding-left: 2rem;">' +
          injiInti.mngbh_s +
          "</div>";
      } else {
        meng_sebagian = "";
      }
      if (injiInti.mcbt_s !== "" && injiInti.mcbt_s !== null) {
        menc_sebagian =
          '<label class="option_item ketSebagian">' +
          '<div class="_jdih">' +
          '<div class="name"><p><i class="fas fa-star"></i> <span id="' +
          injiInti.idperaturan +
          '" data-original-title="' +
          injiInti.tentang +
          '" class="textarealabel-info tooltipx">' +
          injiInti.jns +
          " " +
          injiInti.no_peraturan.toUpperCase() +
          "/" +
          injiInti.tahun +
          "</span>" +
          "Mencabut Sebagian Dengan Ketentuan Sebagai Berikut:</p></div>" +
          "</div>" +
          '</label><div style="padding-left: 2rem;">' +
          injiInti.mcbt_s +
          "</div>";
      } else {
        menc_sebagian = "";
      }
      const isiPohonarray = [];
      const i_ats = [];
      const i_bwh = [];
      let dcs = sttData.result.dcs,
        dc = sttData.result.dc,
        dus = sttData.result.dus,
        du = sttData.result.du,
        mc = sttData.result.mc,
        me = sttData.result.me;
      if (sttData.result.dcs !== "") {
        i_bwh.push("DICABUT SEBAGIAN");
        i_ats.push(dcs);
      }
      if (sttData.result.dc !== "") {
        i_bwh.push("DICABUT");
        i_ats.push(dc);
      }
      if (sttData.result.dus !== "") {
        i_bwh.push("DIUBAH SEBAGIAN");
        i_ats.push(dus);
      }
      if (sttData.result.du !== "") {
        i_bwh.push("DIUBAH");
        i_ats.push(du);
      }
      if (menc_sebagian !== "") {
        i_bwh.push("MENCABUT SEBAGIAN");
        i_ats.push(menc_sebagian);
      }
      if (sttData.result.mc !== "") {
        i_bwh.push("MENCABUT");
        i_ats.push(mc);
      }
      if (meng_sebagian !== "") {
        i_bwh.push("MENGUBAH SEBAGIAN");
        i_ats.push(meng_sebagian);
      }
      if (sttData.result.me !== "") {
        i_bwh.push("MENGUBAH");
        i_ats.push(me);
      }
      const isipohonTerkait = sttData.result.tk;
      let class1, class2, class11, class21, isiStatus, isiTerkait;
      if (i_bwh.length > 0) {
        class1 = "h6-responsive level-2 rectangle pohonTerk liakx";
        class2 = "level-3-wrapper";
      } else {
        class1 = "h6-responsive level-2 rectangle pohonTerk";
        class2 = "level-3-wrapper segok_ko";
      }

      if (isipohonTerkait !== undefined) {
        class11 = "h6-responsive level-2 rectangle pohonTerk liakx";
        class21 = "level-3-wrapper";
      } else {
        class11 = "h6-responsive level-2 rectangle pohonTerk";
        class21 = "level-3-wrapper segok_ko";
      }

      let kurukko = "";
      if (i_bwh.length > 0) {
        i_bwh.map((isi, i) => {
          let c1 = "cpohon" + idpohon + i;
          let liakstatus;
          if (0 === i) {
            liakstatus = 'checked="checked"';
          } else {
            liakstatus = "";
          }
          let pchComma = i_ats[i] ? i_ats[i].split("<label") : [];
          let loopArrayIsi = "";
          pchComma.map((xx, xi) => {
            if (xi > 0) {
              let jd = "<label" + xx;
              loopArrayIsi +=
                '<li><span class="tree_label">' + jd + "</span></li>";
            }
          });
          kurukko +=
            '<li key="' +
            i +
            '">' +
            '<input type="checkbox" ' +
            liakstatus +
            ' id="' +
            c1 +
            '" />' +
            '<label class="tree_label" for="' +
            c1 +
            '">' +
            capitalizeCase(isi) +
            "</label>" +
            "<ul>" +
            "<li>" +
            '<ul class="ulTerkait">' +
            loopArrayIsi +
            "</ul>" +
            "</li>" +
            "</ul>" +
            "</li>";
        });
      }

      let kurukkoTerkait = "";
      if (isipohonTerkait !== undefined) {
        Object.keys(isipohonTerkait).map((is_t, i_t) => {
          let tpohon = "tpohon" + idpohon + i_t;
          let sttter_p;
          if (0 === i_t) {
            sttter_p = 'checked="checked"';
          } else {
            sttter_p = "";
          }
          let isiMultiterkait = "";
          isipohonTerkait[is_t].map((x_is_t, i_is_t) => {
            isiMultiterkait +=
              '<li><span class="tree_label">' + x_is_t + "</span></li>";
          });

          kurukkoTerkait +=
            '<li key="' +
            i_t +
            '">' +
            '<input type="checkbox" ' +
            sttter_p +
            ' id="' +
            tpohon +
            '" />' +
            '<label class="tree_label hurufBesar" for="' +
            tpohon +
            '"><span>' +
            is_t +
            "</span></label>" +
            "<ul>" +
            "<li>" +
            '<ul class="ulTerkait">' +
            isiMultiterkait +
            "</ul>" +
            "</li>" +
            "</ul>" +
            "</li>";
        });
      }
      isiPohonarray.push(
        '<div id="' +
          injiInti.idperaturan +
          '" class="tabPohon">' +
          '<h6 class="h6-responsive level-1 rectangle tooltipx" data-original-title="' +
          injiInti.tentang +
          '">' +
          injiInti.jns +
          " " +
          injiInti.no_peraturan +
          "/" +
          injiInti.tahun +
          "</h6>" +
          '<ol class="level-2-wrapper">' +
          '<li><h6 class="' +
          class1 +
          '"><span>STATUS PERATURAN</span></h6>' +
          '<ol class="' +
          class2 +
          '">' +
          "<li>" +
          '<ul class="tree">' +
          kurukko +
          "</ul>" +
          "</li>" +
          "</ol>" +
          "</li>" +
          '<li><h6 class="' +
          class11 +
          '"><span>PERATURAN TERKAIT</span></h6>' +
          '<ol class="' +
          class21 +
          '">' +
          "<li>" +
          '<ul class="tree">' +
          kurukkoTerkait +
          "</ul>" +
          "</li>" +
          "</ol>" +
          "</li>" +
          "</ol>" +
          "</div>"
      );
      let divpohon_id = document.querySelectorAll(".containertree .tabPohon");
      let up_record = divpohon_id.length + 1;
      let isiRecord, posisiP;
      for (let element of document.getElementsByClassName("tabPohon")) {
        element.style.display = "none";
      }
      for (let ix = 0; ix < divpohon_id.length; ix++) {
        let id_nx = divpohon_id[ix].id;
        if (id_nx === idpohon) {
          isiRecord = id_nx;
          posisiP = ix;
        }
      }
      if (isiRecord === undefined) {
        setTotalRecords(up_record);
        setCurrentPage(up_record);
        updatemyArraypohon((arr) => [...arr, isiPohonarray]);
      } else {
        let jd_posisi = posisiP + 1;
        let div_p = document.querySelectorAll(".tabPohon");
        for (let i = 0; i < div_p.length; i++) {
          let id_n = div_p[i].id;
          if (id_n === idpohon) {
            div_p[i].style.display = "block";
          }
        }
        setCurrentPage(jd_posisi);
      }
      // Initialize tooltips if jQuery and tooltip plugin are available
      if (typeof $ !== 'undefined' && $.fn.tooltip) {
        $(".tooltipx").tooltip();
      }
      let labelpohon = document.querySelectorAll(
        ".tabPohon#" + idpohon + " .tree_label .textarealabel-info"
      );
      for (let i = 0; i < labelpohon.length; i++) {
        let textUrl = labelpohon[i].innerText.split(" ");
        let id_n = labelpohon[i].id;
        let stt_n = labelpohon[i].getAttribute("status");
        let noCheck, noCheck2, noCheck3, noCheck4;
        sttData.result.mcs.forEach(function (itm, id) {
          if (id_n === itm) {
            noCheck = itm;
          }
        });
        sttData.result.mes.forEach(function (itm, id) {
          if (id_n === itm) {
            noCheck2 = itm;
          }
        });
        sttData.result.d_rub_s.forEach(function (itm, id) {
          if (id_n === itm) {
            noCheck3 = itm;
          }
        });
        sttData.result.d_cab_s.forEach(function (itm, id) {
          if (id_n === itm) {
            noCheck4 = itm;
          }
        });
        if (
          (noCheck === undefined &&
            noCheck2 === undefined &&
            noCheck3 === undefined &&
            noCheck4 === undefined &&
            stt_n !== "diluar") ||
          id_n === injiInti.idperaturan
        ) {
          labelpohon[i].style.color = "#595968";
        }
        labelpohon[i].onclick = function () {
          if (
            (noCheck !== undefined &&
              noCheck2 !== undefined &&
              noCheck3 !== undefined &&
              noCheck4 !== undefined &&
              stt_n === "diluar") ||
            id_n !== injiInti.idperaturan
          ) {
            let jdidNoper = this.id;
            getDataPohon(jdidNoper);
          }
        };
      }
      
      // Reinitialize click handlers and tooltips for new tree content
      setTimeout(() => {
        initializeClickHandlers();
        // Initialize tooltips if jQuery and tooltip plugin are available
        if (typeof $ !== 'undefined' && $.fn.tooltip) {
          $(".tooltipx").tooltip();
        }
      }, 200);
    }
  }

  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    for (let element of document.getElementsByClassName("tabPohon")) {
      element.style.display = "none";
    }
    let divpohon = document.querySelectorAll(".tabPohon");
    for (let i = 0; i < divpohon.length; i++) {
      let id_n = i + 1;
      if (id_n === pageNumber) {
        divpohon[i].style.display = "block";
      }
    }
  };

  return (
    <div>
      {showLoading && <CustomLoadingScreen />}
      <Page title="Detail Produk Hukum">
        <div className="container-fluid pl-2 pr-2 mt-5 mb-5 detailRecord">
          <section className="mb-6 row">
            <div className="col-md-8 mb-3">
              <div className="card card-cascade narrower mb-3 d_j_f0 scrollHor mt-5">
                <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
                  <h6 className="h6-responsive mb-0 pl-2">Keterangan</h6>
                </div>
                <div className="row card-body pt-3 pb-3 mr-1 ml-0 pr-0 pl-0">
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">TIPE DOKUMEN</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">
                      {rowData.nama_jenis.toUpperCase()}
                    </div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">JUDUL</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">
                      {rowData.nama_jenis.toUpperCase()} NOMOR{" "}
                      {rowData.no_peraturan} TAHUN {rowData.tahun} TENTANG{" "}
                      {rowData.tentang}
                    </div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">T.E.U Badan/Pengarang</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">{rowData.teu}</div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Nomor Peraturan</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">{rowData.no_peraturan}</div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Jenis/Bentuk Peraturan</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">
                      {rowData.nama_jenis.toUpperCase()}
                    </div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Singkatan Peraturan</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">
                      {rowData.jns.toUpperCase()}
                    </div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Tempat Penetapan</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">{rowData.tempat}</div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    {rowData.tgl_di !== "0000-00-00" &&
                    rowData.tgl_di !== null ? (
                      <div>
                        <div className="ket_judldata2">Tanggal-Bulan-Tahun</div>
                        <div className="ket_dots2">:</div>
                        <div className="ket_isidata2">
                          - {rowData.status}{" "}
                          {moment(rowData.tgl_di).format("LL")}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="ket_judldata2">Tanggal-Bulan-Tahun</div>
                        <div className="ket_dots2">:</div>
                        <div className="ket_isidata2">-</div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    {rowData.diundangkan !== "0000-00-00" &&
                    rowData.diundangkan !== null ? (
                      <div>
                        <div className="ket_judldata2">&nbsp;</div>
                        <div className="ket_dots2">:</div>
                        <div className="ket_isidata2">
                          - Diundangkan{" "}
                          {moment(rowData.diundangkan).format("LL")}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="ket_judldata2">&nbsp;</div>
                        <div className="ket_dots2">:</div>
                        <div className="ket_isidata2">-</div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    {rowData.ln !== 0 ? (
                      <div>
                        <div className="ket_judldata2">Sumber</div>
                        <div className="ket_dots2">:</div>
                        <div className="ket_isidata2">
                          {rowData.idjenis !== "JNS.07" &&
                          rowData.idjenis !== "JNS.08"
                            ? "LN"
                            : "BN"}{" "}
                          Republik Indonesia Nomor {rowData.ln}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="ket_judldata2">Sumber</div>
                        <div className="ket_dots2">:</div>
                        <div className="ket_isidata2">-</div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    {rowData.tln !== 0 ? (
                      <div>
                        <div className="ket_judldata2">&nbsp;</div>
                        <div className="ket_dots2">:</div>
                        <div className="ket_isidata2">
                          TLN Republik Indonesia Nomor {rowData.tln}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="ket_judldata2">&nbsp;</div>
                        <div className="ket_dots2">:</div>
                        <div className="ket_isidata2">-</div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Subjek</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">{rowData.subjek}</div>
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
                    <div className="ket_isidata">{rowData.bidang_hukum}</div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Lampiran</div>
                    <div className="ket_dots">:</div>
                    <div className="ket_isidata">
                      {data.isidata.file.length > 0 ? (
                        <div>
                          <div>Jumlah File: {data.isidata.file.length}</div>
                          {rowFile}
                        </div>
                      ) : (
                        <h6 className="h6-responsive pt-1">
                          Tidak Ada Lampiran
                        </h6>
                      )}
                    </div>
                  </div>
                  <div className="col-md-12 pl-3 pr-1">
                    <div className="ket_judldata">Abstrak</div>
                    <div className="ket_dots">:</div>
                    {data.isidata.file.length > 0 ? (
                      <div className="ket_isidata">
                        <p>{rowData.keterangan}</p>
                      </div>
                    ) : (
                      <div className="ket_isidata">-</div>
                    )}
                  </div>
                  <div className="col-md-12 pl-3 pr-1 text-right">
                    <TwitterShareButton
                      url={`${server}/detail/${rowData.jns}/${
                        rowData.no_peraturan
                      }/${rowData.tahun}/${encodeURI(rowData.tentang)}`}
                      title={`Peraturan ${rowData.jns} ${rowData.no_peraturan}/${rowData.tahun} Tentang ${rowData.tentang}`}
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <FacebookShareButton
                      url={`${server}/detail/${rowData.jns}/${
                        rowData.no_peraturan
                      }/${rowData.tahun}/${encodeURI(rowData.tentang)}`}
                      quote={`Peraturan ${rowData.jns} ${rowData.no_peraturan}/${rowData.tahun} Tentang ${rowData.tentang}`}
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TelegramShareButton
                      url={`${server}/detail/${rowData.jns}/${
                        rowData.no_peraturan
                      }/${rowData.tahun}/${encodeURI(rowData.tentang)}`}
                      title={`Peraturan ${rowData.jns} ${rowData.no_peraturan}/${rowData.tahun} Tentang ${rowData.tentang}`}
                    >
                      <TelegramIcon size={32} round />
                    </TelegramShareButton>
                    <WhatsappShareButton
                      url={`${server}/detail/${rowData.jns}/${
                        rowData.no_peraturan
                      }/${rowData.tahun}/${encodeURI(rowData.tentang)}`}
                      title={`Peraturan ${rowData.jns} ${rowData.no_peraturan}/${rowData.tahun} Tentang ${rowData.tentang}`}
                      separator=":: "
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              {data.isidata.file.length > 0 ? (
                <div className="card card-cascade narrower mb-3 d_j_f scrollHor mt-5">
                  <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
                    <h6 className="h6-responsive mb-0 pl-2">File Peraturan</h6>
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
                        <div>{data.isidata.file.length}</div>
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
                    <h6 className="h6-responsive mb-0 pl-2">
                      Lampiran Peraturan
                    </h6>
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
                        <div>{data.isidata.file.length}</div>
                      </div>
                      <div className="pl-3 col-md-12">
                        <div className="pl-4">{rowFile}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div>{isitabsStatus}</div>
              <div>{isitabsTerkait}</div>
              <div>{isitabsUjimateril}</div>
            </div>
            <div className="card card-cascade narrower mb-3 mt-5">
              <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
                <h6 className="h6-responsive mb-0 pl-2">
                  Diagram Pohon Peraturan
                </h6>
              </div>
              <div
                className="card-body pt-3 pb-2 mr-0 ml-0 pr-0 pl-3"
                style={{ overflowX: "auto" }}
              >
                <div className="containertree">
                  <div id={rowData.idperaturan} className="tabPohon">
                    <h6
                      className="h6-responsive level-1 rectangle tooltipx"
                      data-original-title={rowData.tentang}
                    >
                      {rowData.jns} {rowData.no_peraturan}/{rowData.tahun}
                    </h6>
                    <ol className="level-2-wrapper">
                      <li>
                        <h6
                          className={
                            0 < i_bwh.length
                              ? "h6-responsive level-2 rectangle pohonTerk liakx"
                              : "h6-responsive level-2 rectangle pohonTerk"
                          }
                        >
                          <span>STATUS PERATURAN</span>
                        </h6>
                        <ol
                          className={
                            0 < i_bwh.length
                              ? "level-3-wrapper"
                              : "level-3-wrapper segok_ko"
                          }
                        >
                          <li>
                            <ul className="tree">
                              {0 < i_bwh.length
                                ? i_bwh.map((isi, i) => {
                                    let c1 = "c1" + isi;
                                    let liakstatus;
                                    if (0 === i) {
                                      liakstatus = "checked";
                                    } else {
                                      liakstatus = "";
                                    }
                                    let pchComma = i_ats[i] ? i_ats[i].split("<label") : [];
                                    return (
                                      <li key={i}>
                                        <input
                                          type="checkbox"
                                          defaultChecked={liakstatus}
                                          id={c1}
                                        />
                                        <label
                                          className="tree_label"
                                          htmlFor={c1}
                                        >
                                          {capitalizeCase(isi)}
                                        </label>
                                        <ul>
                                          <li>
                                            <ul className="ulTerkait">
                                              {pchComma.map((xx, xi) => {
                                                if (xi > 0) {
                                                  let jd = "<label" + xx;
                                                  return (
                                                    <li key={xi}>
                                                      <span
                                                        className="tree_label"
                                                        dangerouslySetInnerHTML={{
                                                          __html: jd,
                                                        }}
                                                      ></span>
                                                    </li>
                                                  );
                                                }
                                              })}
                                            </ul>
                                          </li>
                                        </ul>
                                      </li>
                                    );
                                  })
                                : ""}
                            </ul>
                          </li>
                        </ol>
                      </li>
                      <li>
                        <h6
                          className={
                            undefined !== dTerkaitgroup
                              ? "h6-responsive level-2 rectangle pohonTerk liakx"
                              : "h6-responsive level-2 rectangle pohonTerk"
                          }
                        >
                          <span>PERATURAN TERKAIT</span>
                        </h6>
                        <ol
                          className={
                            undefined !== dTerkaitgroup
                              ? "level-3-wrapper"
                              : "level-3-wrapper segok_ko"
                          }
                        >
                          <li>
                            <ul className="tree">
                              {undefined !== dTerkaitgroup
                                ? Object.keys(dTerkaitgroup).map((isi, i) => {
                                    let c1 = "c1" + isi;
                                    let liakstatus;
                                    if (0 === i) {
                                      liakstatus = "checked";
                                    } else {
                                      liakstatus = "";
                                    }
                                    return (
                                      <li key={i}>
                                        <input
                                          type="checkbox"
                                          defaultChecked={liakstatus}
                                          id={c1}
                                        />
                                        <label
                                          className="tree_label hurufBesar"
                                          htmlFor={c1}
                                        >
                                          <span>{isi}</span>
                                        </label>
                                        <ul>
                                          <li>
                                            <ul className="ulTerkait">
                                              {dTerkaitgroup[isi].map(
                                                (xx, xi) => {
                                                  return (
                                                    <li key={xi}>
                                                      <span
                                                        className="tree_label"
                                                        dangerouslySetInnerHTML={{
                                                          __html: xx,
                                                        }}
                                                      ></span>
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </li>
                                        </ul>
                                      </li>
                                    );
                                  })
                                : ""}
                            </ul>
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </div>
                  {0 < myArraypohon.length &&
                    myArraypohon.map((is, iz) => {
                      return (
                        <div
                          key={iz}
                          dangerouslySetInnerHTML={{ __html: is }}
                        ></div>
                      );
                    })}
                </div>
                {1 < totalRecord && (
                  <Pagination
                    itemClass="page-item"
                    linkClass="page-link waves-effect"
                    activePage={currentPage}
                    itemsCountPerPage={1}
                    totalItemsCount={totalRecord}
                    pageRangeDisplayed={10}
                    onChange={handlePageChange}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
        <div
          className="modal fade"
          id="modalSukaTidak"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modalSukaTidakLabel"
        >
          <div className="modal-dialog cascading-modal" role="document">
            <div className="modal-content">
              <div className="modal-c-tabs">
                <div className="md-tabs light-blue lighten-1 pr-4">
                  <h4 className="h4-responsive mx-auto mb-0 font-weight-bold text-white">
                    Masukkan Email Anda
                  </h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body mb-1 liak_scroll pl-2 pr-2 pt-0">
                  <div className="md-form md-outline">
                    <input
                      type="email"
                      id="email"
                      onChange={changeEmail}
                      name="email"
                      className="form-control"
                      autoComplete="off"
                    />
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <span className="vldnya">{validEmail}</span>
                  </div>
                  <div className="col-xl-12 col-md-12 text-right">
                    <button
                      className="blue-gradient btn btn-md validBtn waves-effect waves-light"
                      onClick={() => handleClickSukaTidak(icnSukaTidak)}
                    >
                      <i
                        className={`fas ${
                          icnSukaTidak === "suka"
                            ? "fas fa-thumbs-up"
                            : "fas fa-thumbs-down"
                        }`}
                      ></i>{" "}
                      {btnSukaTidak}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export async function akukStatus(
  idx,
  dc,
  dcs,
  dd,
  dds,
  dm,
  dms,
  dme,
  dmes,
  dt
) {
  let j_dc, j_dcs, j_dd, j_dds, j_dm, j_dms, j_dme, j_dmes, j_dt;
  if (dc === null && dc === "") {
    j_dc = "";
  } else {
    j_dc = dc;
  }
  if (dcs === null) {
    j_dcs = "";
  } else {
    j_dcs = dcs;
  }
  if (dd === null) {
    j_dd = "";
  } else {
    j_dd = dd;
  }
  if (dds === null) {
    j_dds = "";
  } else {
    j_dds = dds;
  }
  if (dm === null) {
    j_dm = "";
  } else {
    j_dm = dm;
  }
  if (dms === null) {
    j_dms = "";
  } else {
    j_dms = dms;
  }
  if (dme === null) {
    j_dme = "";
  } else {
    j_dme = dme;
  }
  if (dmes === null) {
    j_dmes = "";
  } else {
    j_dmes = dmes;
  }
  if (dt === null) {
    j_dt = "";
  } else {
    j_dt = dt;
  }
  const resOpt = {
    idx: idx,
    dc: j_dc,
    dcs: j_dcs,
    dd: j_dd,
    dds: j_dds,
    dm: j_dm,
    dms: j_dms,
    dme: j_dme,
    dmes: j_dmes,
    dt: j_dt,
  };
  const response = await axiosInstance.post("/api/hukumproduk/status", resOpt);
  if (response.status === 500) {
    return { result: "" };
  } else {
    const resx = await response.data;
    return { result: resx };
  }
}

export async function getServerSideProps(context) {
  const { query } = context;
  const ua = useUserAgent(context.req.headers["user-agent"]);
  let cooKiesId = Math.random().toString(36).substr(2, 5);
  
  // Fix: Add null checks to prevent split() error
  let hdl = query.q ? query.q.split("/") : [];
  let nox = hdl[1] ? hdl[1].split("+").join("/") : "";
  let isiSearch = "",
    isiSelect = "semua";
  let ipAddres, city, region, country;
  if (context.req.headers.cookie !== undefined && cookie && cookie.parse) {
    try {
      const prse = cookie.parse(context.req.headers.cookie);
      if (prse.ip !== "" && prse.ip !== undefined) {
        ipAddres = prse.ip;
      } else {
        ipAddres = "";
      }
      if (prse.city !== "" && prse.city !== undefined) {
        city = prse.city;
      } else {
        city = "";
      }
      if (prse.region !== "" && prse.region !== undefined) {
        region = prse.region;
      } else {
        region = "";
      }
      if (prse.country !== "" && prse.country !== undefined) {
        country = prse.country;
      } else {
        country = "";
      }
    } catch (error) {
      console.error("Cookie parsing error:", error);
      ipAddres = "";
      city = "";
      region = "";
      country = "";
    }
  } else {
    ipAddres = "";
    city = "";
    region = "";
    country = "";
  }

  const resOpt = {
    jns: hdl[0],
    no: nox,
    thn: hdl[2],
    k: "",
  };

  const response = await axiosInstance.post(
    "/api/hukumproduk/detaildata",
    resOpt
  );
  const intiData = await response.data;
  if (intiData.row === undefined) {
    return {
      redirect: {
        destination: "/produk-hukum/All",
        permanent: false,
      },
    };
  }

  const arrOnline = [];
  arrOnline.push({
    browserx: ua.browser,
    osx: `${ua.os} ${ua.osVersion}`,
    ipx: ipAddres,
    wilx: `${city}/${region}`,
    negx: country,
  });

  let meng_sebagian, menc_sebagian;
  if (intiData.row[0].mngbh_s !== "" && intiData.row[0].mngbh_s !== null) {
    meng_sebagian =
      '<label class="option_item ketSebagian">' +
      '<div class="_jdih">' +
      '<div class="name"><p><i class="fas fa-star"></i> <span id="' +
      intiData.row[0].idperaturan +
      '" data-original-title="' +
      intiData.row[0].tentang +
      '" class="textarealabel-info tooltipx">' +
      intiData.row[0].jns +
      " " +
      intiData.row[0].no_peraturan.toUpperCase() +
      "/" +
      intiData.row[0].tahun +
      "</span>" +
      "Mengubah Sebagian Dengan Ketentuan Sebagai Berikut:</p></div>" +
      "</div>" +
      '</label><div style="padding-left: 2rem;">' +
      intiData.row[0].mngbh_s +
      "</div>";
  } else {
    meng_sebagian = "";
  }
  if (intiData.row[0].mcbt_s !== "" && intiData.row[0].mcbt_s !== null) {
    menc_sebagian =
      '<label class="option_item ketSebagian">' +
      '<div class="_jdih">' +
      '<div class="name"><p><i class="fas fa-star"></i> <span id="' +
      intiData.row[0].idperaturan +
      '" data-original-title="' +
      intiData.row[0].tentang +
      '" class="textarealabel-info tooltipx">' +
      intiData.row[0].jns +
      " " +
      intiData.row[0].no_peraturan.toUpperCase() +
      "/" +
      intiData.row[0].tahun +
      "</span>" +
      "Mencabut Sebagian Dengan Ketentuan Sebagai Berikut:</p></div>" +
      "</div>" +
      '</label><div style="padding-left: 2rem;">' +
      intiData.row[0].mcbt_s +
      "</div>";
  } else {
    menc_sebagian = "";
  }
  const [isidata, d_status, mc_s, me_s, jdOnline, onlineArr, iDUser] =
    await Promise.all([
      intiData,
      akukStatus(
        intiData.row[0].idperaturan,
        intiData.row[0].dicabut,
        intiData.row[0].dicabut_sebagian,
        intiData.row[0].diubah,
        intiData.row[0].diubah_sebagian,
        intiData.row[0].mencabut,
        intiData.row[0].mencabutsebagian,
        intiData.row[0].mengubah,
        intiData.row[0].mengubahsebagian,
        intiData.row[0].terkait
      ),
      menc_sebagian,
      meng_sebagian,
      addOnline({
        dataid: {
          idperaturan: intiData.row[0].idperaturan,
          saat_ini: "1",
          keterangan: "lihat",
          user: "",
          tanggal: moment(new Date()).format("YYYY-MM-DD"),
          jam: moment(new Date()).format("HH:mm:ss"),
          browser: ua.browser,
          os: `${ua.os} ${ua.osVersion}`,
          ip: ipAddres,
          wilayah: `${city}/${region}`,
          negara: country,
          userId: cooKiesId,
        },
      }),
      arrOnline,
      cooKiesId,
    ]);

  return {
    props: {
      data: {
        isidata,
        d_status,
        mc_s,
        me_s,
        jdOnline,
        onlineArr,
        iDUser,
        isiSearch,
        isiSelect,
      },
    },
  };
}

export default Dateailperaturan;
