import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db, collection, query, where, onSnapshot } from "../lib/clientApp";
import Page from "../components/page";
import Pagination from "react-js-pagination";
import cookiee from "js-cookie";
// Import cookie only on server side
let cookie;
if (typeof window === "undefined") {
  cookie = require("cookie");
}
import axiosInstance from "../lib/axiosInstance";

const Peraturan = ({ data }) => {
  const router = useRouter();
  let lctx = router.query.q ? router.query.q.split("/") : ["peraturan", "All"];
  const inputVsearch = data.srchx;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [classjdihatas, setclassjdihatas] = useState("");
  const [listJnsCariArray, setlistJnsCariArray] = useState([]);
  const [listThnCariArray, setlistThnCariArray] = useState([]);
  const [dperaturan, setdperaturan] = useState(data.peraturans.result.data);
  const [djenis, setdjenis] = useState(data.dataJenis);
  const [dtahun, setdtahun] = useState(data.dataTahun);
  const [currentPage, setCurrentPage] = useState(data.pagexx || 1);
  const [totalRecord, setTotalRecords] = useState(data.peraturans.result.jml);
  const [listClick, setlistClick] = useState(false);
  const [showMejns, setShowMejns] = useState(true);
  const [showMethn, setShowMethn] = useState(true);
  const [showSepokjns, setShowSepokjns] = useState(false);
  const [showSepokthn, setShowSepokthn] = useState(false);
  const [showlistJnsCari, setshowlistJnsCari] = useState(false);
  const [showlistThnCari, setshowlistThnCari] = useState(false);
  const [statusOnline, setStatusOnline] = useState(
    data.peraturans.result.id_dt
  );

  useEffect(() => {
    if (undefined !== dperaturan && 0 < dperaturan.length && 
        data.peraturans.result.jdid && 
        Array.isArray(data.peraturans.result.jdid) && 
        data.peraturans.result.jdid.length > 0) {
      const dwlviewRef = collection(db, "download_view");
      const q = query(
        dwlviewRef,
        where("idperaturan", "in", data.peraturans.result.jdid)
      );

      const unsubscribe = onSnapshot(q, (colSnapshot) => {
        let newTasks = [];
        colSnapshot.docChanges().forEach((change) => {
          const taskData = change.doc.data().idperaturan;
          newTasks.push(taskData);
        });
        if (newTasks.length > 0 && newTasks !== undefined) {
          const resOpt = {
            idperaturan: [...new Set(newTasks)],
            k: "SelectFooter",
          };
          axiosInstance
            .post("/api/hukumproduk/detaildata", resOpt)
            .then((response) => {
              let json = response.data;
              if (json.row !== undefined) {
                setStatusOnline((prevStatusOnline) => {
                  return prevStatusOnline.map(
                    (obj) => json.row.find((o) => o.id === obj.id) || obj
                  );
                });
              }
            })
            .catch((error) => {
              console.error("Error updating status:", error);
            });
        }
      });
      return () => unsubscribe();
    }
  }, [dperaturan, data.peraturans.result.jdid]);

  const handleClickList = (e) => {
    setlistClick(false);
  };

  function clickDetailEvent(j, n, t, tt) {
    const atsSttLiak = document.getElementById("p_lihan").value;
    let noSlash = n.split("/").join("+");
    cookiee.set("stsstt", atsSttLiak, { secure: true, expires: 7, path: "/" });
    let glr = tt.toUpperCase().split(" ").join("+").split("/").join("-");
    router.push(
      "/detail/" + j + "/" + noSlash + "/" + t + "/" + encodeURI(glr),
      undefined,
      { shallow: true }
    );
  }

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

  useEffect(() => {
    setShowMejns(false);
    if (lctx[0] === "Terbaru") {
      setclassjdihatas("Terbaru");
    } else if (lctx[0] === "Terpopuler") {
      setclassjdihatas("Terpopuler");
    } else {
      setclassjdihatas("Semua");
    }

    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      if (lctx[1] !== undefined) {
        $(".s-btn-close").show();
      } else {
        $(".s-btn-close").hide();
      }

      $("#sepoktentang").on("change", function () {
        if ($(this).val() === "") {
          cookiee.set("akuksearch", "");
        }
      });

      $('#p_lihan option[value="' + data.sttAtas + '"]').attr(
        "selected",
        "selected"
      );
      $('#status option[value="' + data.sttxx + '"]').attr(
        "selected",
        "selected"
      );

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
    }, 100);
  }, [data, lctx]);

  const handleClickClose = async (cls) => {
    // Prevent multiple simultaneous operations
    if (isLoadingData) {
      return;
    }

    $("#sepoktentang").val("");
    $(".s-btn-close").hide();
    
    // Set loading state
    setIsLoadingData(true);
    setCurrentPage(1);

    // Clear search cookies
    cookiee.set("stsstt", "semua", { secure: true, expires: 7, path: "/" });
    cookiee.set("akuksearch", "", { secure: true, expires: 7, path: "/" });
    $('#p_lihan option[value="semua"]').attr("selected", "selected");

    try {
      // Get current filter values
      const jnsFilter = cookiee.get("jns_x") || "";
      const thnFilter = cookiee.get("thn_x") || "";
      const sttFilter = cookiee.get("stt") || "";

      // Fetch data without search term
      const clearData = await getPeraturan(
        "semua",
        "All",
        "",
        1,
        10,
        jnsFilter,
        thnFilter,
        sttFilter
      );

      // Update data state
      setdperaturan(clearData.result.data);
      setTotalRecords(clearData.result.jml);
      setIsLoadingData(false);

      // Reset URL to default
      const targetUrl = "/produk-hukum/All";
      const pageUrl = "/peraturan?q=All";
      router.push(pageUrl, targetUrl, { shallow: true });

    } catch (error) {
      console.error("Error clearing search:", error);
      setIsLoadingData(false);
      
      // Fallback URL reset even on error
      const targetUrl = "/produk-hukum/All";
      const pageUrl = "/peraturan?q=All";
      router.push(pageUrl, targetUrl, { shallow: true });
    }
  };

  const handleClickbtnSearch = async (csp) => {
    // Prevent multiple simultaneous searches
    if (isLoadingData) {
      return;
    }

    const searchInput = document.getElementById("sepoktentang");
    const atsSttLiak = document.getElementById("p_lihan").value;

    if (!searchInput || !searchInput.value.trim()) {
      console.warn("Search input is empty");
      return;
    }

    const searchTerm = searchInput.value.trim();
    let link = searchTerm
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join("+")
      .split("/")
      .join("-");

    // Set loading state
    setIsLoadingData(true);
    setCurrentPage(1);

    // Save search state to cookies
    cookiee.set("stsstt", atsSttLiak, { secure: true, expires: 7, path: "/" });
    cookiee.set("pagex", 1, { secure: true, expires: 7, path: "/" });
    cookiee.set("akuksearch", link, { secure: true, expires: 7, path: "/" });

    try {
      // Get current filter values
      const jnsFilter = cookiee.get("jns_x") || "";
      const thnFilter = cookiee.get("thn_x") || "";
      const sttFilter = cookiee.get("stt") || "";

      const category = lctx[0] && lctx[0] !== "peraturan" ? lctx[0] : "All";

      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setIsLoadingData(false);
        console.error("Search timeout after 30 seconds");
      }, 30000);

      // Fetch data immediately
      const searchData = await getPeraturan(
        atsSttLiak || "semua",
        category,
        searchTerm,
        1,
        10,
        jnsFilter,
        thnFilter,
        sttFilter
      );

      clearTimeout(timeoutId);

      // Update data state
      if (searchData && searchData.result) {
        setdperaturan(searchData.result.data || []);
        setTotalRecords(searchData.result.jml || 0);
      }
      setIsLoadingData(false);

      // Update URL after successful search
      const targetUrl = "/produk-hukum/" + category + "/" + encodeURI(link);
      const pageUrl = "/peraturan?q=" + category + "/" + encodeURI(link);
      router.push(pageUrl, targetUrl, { shallow: true });

      // Show cross button
      $(".s-btn-close").show();

    } catch (error) {
      console.error("Error searching:", error);
      setIsLoadingData(false);
    }
  };

  const onKeyPressSearch = async (x) => {
    const searchValue = x.target.value.trim();

    if (x.keyCode === 13) {
      // Prevent multiple simultaneous searches
      if (isLoadingData) {
        return;
      }

      if (!searchValue) {
        console.warn("Search value is empty");
        return;
      }

      let link = searchValue
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("+")
        .split("/")
        .join("-");

      const atsSttLiak = document.getElementById("p_lihan").value;
      
      // Set loading state
      setIsLoadingData(true);
      setCurrentPage(1);

      // Save search state to cookies
      cookiee.set("stsstt", atsSttLiak, {
        secure: true,
        expires: 7,
        path: "/",
      });
      cookiee.set("pagex", 1, { secure: true, expires: 7, path: "/" });
      cookiee.set("akuksearch", link, { secure: true, expires: 7, path: "/" });

      try {
        // Get current filter values
        const jnsFilter = cookiee.get("jns_x") || "";
        const thnFilter = cookiee.get("thn_x") || "";
        const sttFilter = cookiee.get("stt") || "";

        const category = lctx[0] && lctx[0] !== "peraturan" ? lctx[0] : "All";

        // Fetch data immediately
        const searchData = await getPeraturan(
          atsSttLiak || "semua",
          category,
          searchValue,
          1,
          10,
          jnsFilter,
          thnFilter,
          sttFilter
        );

        // Update data state
        setdperaturan(searchData.result.data);
        setTotalRecords(searchData.result.jml);
        setIsLoadingData(false);

        // Update URL after successful search
        const targetUrl = "/produk-hukum/" + category + "/" + encodeURI(link);
        const pageUrl = "/peraturan?q=" + category + "/" + encodeURI(link);
        router.push(pageUrl, targetUrl, { shallow: true });

        // Show cross button
        $(".s-btn-close").show();

      } catch (error) {
        console.error("Error searching:", error);
        setIsLoadingData(false);
      }
      x.preventDefault();
    }

    if (searchValue === "") {
      $(".s-btn-close").hide();
    } else {
      $(".s-btn-close").show();
    }
  };

  const handleClickSemua = (s) => {
    $(".m-ats-jdih").removeClass("activex");
    let pr = "";
    if (lctx[1] !== "" && lctx[1] !== undefined) {
      pr = "/" + lctx[1];
    }

    let targetUrl, pageUrl;
    const hoverData = s.target.getAttribute("data-hover");

    if (hoverData === "TERBARU") {
      targetUrl = "/produk-hukum/Terbaru" + pr;
      pageUrl = "/peraturan?q=Terbaru" + pr;
    } else if (hoverData === "TERPOPULER") {
      targetUrl = "/produk-hukum/Terpopuler" + pr;
      pageUrl = "/peraturan?q=Terpopuler" + pr;
    } else if (hoverData === "MATRIKS") {
      targetUrl = "/matriks/";
      pageUrl = "/matriks/";
    } else {
      targetUrl = "/produk-hukum/All" + pr;
      pageUrl = "/peraturan?q=All" + pr;
    }

    // Check if we're not already on the target URL
    if (router.asPath !== targetUrl) {
      if (hoverData === "TERBARU") {
        cookiee.set("pagex", 1);
        router.push(pageUrl, targetUrl, { shallow: true });
      } else if (hoverData === "TERPOPULER") {
        cookiee.set("pagex", 1);
        router.push(pageUrl, targetUrl, { shallow: true });
      } else if (hoverData === "MATRIKS") {
        router.push(pageUrl, targetUrl, { shallow: true });
      } else {
        cookiee.set("pagex", 1);
        router.push(pageUrl, targetUrl, { shallow: true });
      }
    }
    s.preventDefault();
  };

  const handleClicklbhjenis = async (x) => {
    if (djenis.length > 11 || djenis.length >= data.jml_j) {
      setShowSepokjns(true);
      setTimeout(() => {
        const jnscrfield = document.querySelector(`input[id=sepokjenis]`);
        if (jnscrfield) jnscrfield.focus();
      }, 100);
    } else {
      const akukJns = await getJenis(6);
      setdjenis(akukJns.result.data);
      if (akukJns.result.data.length >= akukJns.result.jml) {
        setShowMejns(false);
      } else {
        setShowMejns(true);
      }
    }
  };

  const handleClicklbhtahun = async (x) => {
    if (dtahun.length > 11 || dtahun.length >= data.jml_t) {
      setShowSepokthn(true);
      setTimeout(() => {
        const jnscrfield = document.querySelector(`input[id=sepoktahun]`);
        if (jnscrfield) jnscrfield.focus();
      }, 100);
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
    const searchValue = x.target.value;
    if (!searchValue.trim()) {
      setlistThnCariArray([]);
      setshowlistThnCari(false);
      return;
    }

    try {
      const jsonD = await cariTahun(searchValue);
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
    } catch (error) {
      console.error("Error searching tahun:", error);
      setlistThnCariArray([]);
      setshowlistThnCari(false);
    }
  };

  const handleChangejenis = async (x) => {
    const searchValue = x.target.value;
    if (!searchValue.trim()) {
      setlistJnsCariArray([]);
      setshowlistJnsCari(false);
      return;
    }

    try {
      let stringA = searchValue.toUpperCase();
      const jsonData = await cariJenis(stringA);
      setshowlistJnsCari(true);

      if (jsonData.result.length > 0) {
        let array1 = [];
        $.each(jsonData.result, function (i, v) {
          let chk_c = $("#listJns")
            .find("input[type=checkbox][value='" + v.jns + "']")
            .is(":checked");
          array1.push(
            <label
              className="option_item"
              key={v.jns}
              id={v.jns}
              onChange={handleClickjnsCari}
            >
              <input
                type="checkbox"
                className="checkbox"
                name="jns_x"
                value={v.jns}
                defaultChecked={chk_c ? true : false}
              />
              <div className="option_inner _jdih">
                <div className="tickmark"></div>
                <div className="name">{v.jns}</div>
              </div>
            </label>
          );
        });
        setlistJnsCariArray(array1);
      }
    } catch (error) {
      console.error("Error searching jenis:", error);
      setlistJnsCariArray([]);
      setshowlistJnsCari(false);
    }
  };

  const handleClickjnsCari = (e) => {
    let prn = e.currentTarget.getAttribute("id");
    let $clone = $("#listJnsCari label#" + prn).clone();
    if (
      e.target.checked &&
      $("#listJns #" + prn) !== $("#listJnsCari label#" + prn)
    ) {
      $("#listJns #" + prn).remove();
      $("#listJns").prepend($clone);
      $("#listJns .checkbox").attr("name", "jns[]");
    } else {
      $("#listJns #" + prn + " .checkbox").prop("checked", false);
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

  const handleCloseJenis = (j) => {
    $("#sepokjenis").val("");
    setShowSepokjns(false);
    setshowlistJnsCari(false);
  };

  const handleCloseTahun = (t) => {
    $("#sepoktahun").val("");
    setShowSepokthn(false);
    setshowlistThnCari(false);
  };

  const hendleBtnTerapkan = async (trapkan) => {
    const markedCheckboxJenis = document.getElementsByName("jns[]");
    const markedCheckboxTahun = document.getElementsByName("thn[]");
    const statusSelect = document.getElementById("status");

    if (!statusSelect) {
      console.error("Status select element not found");
      return;
    }

    const statusLiak = statusSelect.value;
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

    // Set cookies
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
    cookiee.set("stt", statusLiak, { secure: true, expires: 7, path: "/" });
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

    // Apply filters immediately without page refresh
    setIsLoadingData(true);
    setCurrentPage(1);

    try {
      const category = lctx[0] && lctx[0] !== "peraturan" ? lctx[0] : "All";
      let searchTerm = "";
      if (lctx[1] !== undefined && lctx[1] !== "") {
        searchTerm = lctx[1];
      }

      setIsLoadingData(true);
      const filteredData = await getPeraturan(
        data.sttAtas || "semua",
        category,
        searchTerm,
        1,
        10,
        arrJns.join(","),
        arrThn.join(","),
        statusLiak
      );

      setdperaturan(filteredData.result.data);
      setTotalRecords(filteredData.result.jml);
      setIsLoadingData(false);

      // Update URL without refresh with filter parameters
      const queryParams = new URLSearchParams();
      if (arrJns.length > 0) queryParams.set('jenis', arrJns.join(','));
      if (arrThn.length > 0) queryParams.set('tahun', arrThn.join(','));
      if (statusLiak && statusLiak !== '') queryParams.set('status', statusLiak);
      
      const queryString = queryParams.toString();
      const targetUrl =
        "/produk-hukum/" + category + (searchTerm ? "/" + searchTerm : "") + (queryString ? "?" + queryString : "");
      const pageUrl =
        "/peraturan?q=" + category + (searchTerm ? "/" + searchTerm : "") + (queryString ? "&" + queryString : "");

      router.push(pageUrl, targetUrl, { shallow: true });
    } catch (error) {
      console.error("Error applying filters:", error);
      // Fallback to page refresh if API call fails
      const category = lctx[0] && lctx[0] !== "peraturan" ? lctx[0] : "All";
      let akuksearch = "";
      if (lctx[1] !== undefined && lctx[1] !== "") {
        akuksearch = "/" + lctx[1];
      }

      const queryParams = new URLSearchParams();
      if (arrJns.length > 0) queryParams.set('jenis', arrJns.join(','));
      if (arrThn.length > 0) queryParams.set('tahun', arrThn.join(','));
      if (statusLiak && statusLiak !== '') queryParams.set('status', statusLiak);
      
      const queryString = queryParams.toString();
      const targetUrl = "/produk-hukum/" + category + akuksearch + (queryString ? "?" + queryString : "");
      const pageUrl = "/peraturan?q=" + category + akuksearch + (queryString ? "&" + queryString : "");

      router.push(pageUrl, targetUrl, { shallow: false });
    } finally {
      setIsLoadingData(false);
    }
  };

  const hendleBtnReset = async (rset) => {
    // Clear all filter cookies
    cookiee.set("inji_jns", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("jns_x", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("thn_x", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("stt", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("jns_unyin", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("thn_unyin", "", { secure: true, expires: 7, path: "/" });
    
    // Clear search cookies too
    cookiee.set("stsstt", "semua", { secure: true, expires: 7, path: "/" });
    cookiee.set("akuksearch", "", { secure: true, expires: 7, path: "/" });
    
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

    // Reset form elements
    setTimeout(() => {
      $("#status").val("");
      $("#listJns input[type=checkbox]").prop("checked", false);
      $("#listThn input[type=checkbox]").prop("checked", false);
      $("#sepoktentang").val("");  // Clear search input
      $(".s-btn-close").hide();    // Hide search clear button
      $('#p_lihan option[value="semua"]').attr("selected", "selected"); // Reset search type
    }, 100);

    // Apply reset immediately without page refresh
    setIsLoadingData(true);
    setCurrentPage(1);

    try {
      // Reset should go to default state without preserving search terms
      const resetData = await getPeraturan(
        "semua",
        "All",
        "",
        1,
        10,
        "",
        "",
        ""
      );

      setdperaturan(resetData.result.data);
      setTotalRecords(resetData.result.jml);
      setIsLoadingData(false);

      // Reset URL to completely clean state
      const targetUrl = "/produk-hukum/All";
      const pageUrl = "/peraturan?q=All";
      router.push(pageUrl, targetUrl, { shallow: true });

    } catch (error) {
      console.error("Error resetting filters:", error);
      setIsLoadingData(false);
      
      // Fallback URL reset to clean state even on error
      const targetUrl = "/produk-hukum/All";
      const pageUrl = "/peraturan?q=All";
      router.push(pageUrl, targetUrl, { shallow: true });
    }
  };

  const handlePageChange = async (pageNumber) => {
    setIsLoadingData(true);
    setCurrentPage(pageNumber);
    cookiee.set("pagex", pageNumber, { secure: true, expires: 7, path: "/" });

    try {
      // Get current filter values
      const jnsFilter = cookiee.get("jns_x") || "";
      const thnFilter = cookiee.get("thn_x") || "";
      const sttFilter = cookiee.get("stt") || "";
      
      // Get search term from both URL context and cookies
      const category = lctx[0] && lctx[0] !== "peraturan" ? lctx[0] : "All";
      let searchTerm = "";
      if (lctx[1] !== undefined && lctx[1] !== "") {
        searchTerm = lctx[1];
      } else {
        // Also check cookies for search term
        const cookieSearch = cookiee.get("akuksearch") || "";
        if (cookieSearch) {
          searchTerm = cookieSearch.split("+").join(" ");
        }
      }
      
      // Get search type
      const searchType = cookiee.get("stsstt") || "semua";

      const pageData = await getPeraturan(
        searchType,
        category,
        searchTerm,
        pageNumber,
        10,
        jnsFilter,
        thnFilter,
        sttFilter
      );

      setdperaturan(pageData.result.data);
      setTotalRecords(pageData.result.jml);
      setIsLoadingData(false);
    } catch (error) {
      console.error("Error changing page:", error);
      // Fallback to page refresh if API call fails
      const category = lctx[0] && lctx[0] !== "peraturan" ? lctx[0] : "All";
      let akuksearch = "";
      if (lctx[1] !== undefined && lctx[1] !== "") {
        akuksearch = "/" + lctx[1];
      }

      const targetUrl = "/produk-hukum/" + category + akuksearch;
      const pageUrl = "/peraturan?q=" + category + akuksearch;

      router.push(pageUrl, targetUrl, { shallow: false });
    } finally {
      setIsLoadingData(false);
    }
  };

  return (
    <Page title="Produk Hukum">
      <section className="isi_data_x">
        <div className="row ml-0 mr-0 pt-4 mb-5">
          <div className="col-lg-9 col-md-12 pl-0 pr-0 full-balakni">
            <div className="backrMenuSearch">
              <div className="search-box sepok_ats">
                <label className="selectdiv">
                  <select className="minimal custom-select" id="p_lihan">
                    <option value="semua">Semua</option>
                    <option value="tentang">Tentang</option>
                    <option value="nomor">Nomor</option>
                  </select>
                </label>
                <form
                  className="search-form"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    className="form-control"
                    id="sepoktentang"
                    onKeyDown={onKeyPressSearch}
                    onChange={(e) => {
                      const value = e.target.value.trim();
                      if (value === "") {
                        $(".s-btn-close").hide();
                      } else {
                        $(".s-btn-close").show();
                      }
                    }}
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
              <div className="menu_khua">
                <ul className="snip1135">
                  <li>
                    <a
                      href="#"
                      className={
                        classjdihatas === "Semua"
                          ? "m-ats-jdih sm activex"
                          : "m-ats-jdih sm"
                      }
                      data-hover="SEMUA"
                      onClick={handleClickSemua}
                    >
                      SEMUA
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={
                        classjdihatas === "Terbaru"
                          ? "m-ats-jdih tb activex"
                          : "m-ats-jdih tb"
                      }
                      data-hover="TERBARU"
                      onClick={handleClickSemua}
                    >
                      TERBARU
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={
                        classjdihatas === "Terpopuler"
                          ? "m-ats-jdih tp activex"
                          : "m-ats-jdih tp"
                      }
                      data-hover="TERPOPULER"
                      onClick={handleClickSemua}
                    >
                      TERPOPULER
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div
              id="isiRecord"
              className="row view-group ml-0 mr-0 isidataRecord"
            >
              {isLoadingData ? (
                // Skeleton loading
                Array.from({ length: 10 }).map((_, index) => (
                  <section
                    className={
                      listClick
                        ? "dataLoad col-12 col-md-6 col-lg-4 mt-3"
                        : "dataLoad col-12 col-md-12 mt-3"
                    }
                    key={`skeleton-${index}`}
                  >
                    <div className="card listbg" style={{ opacity: 0.6 }}>
                      <div className="row">
                        <div className="col-xl-12 col-md-12 mb-0">
                          <div className="card-body pt-0 pr-0 pl-0 cardbodystyle">
                            <div className="row col-md-12 pl-1 pr-1 pt-1 pb-1 ml-0 mr-0">
                              <div className="item list-group-item mb-0">
                                <div className="caption">
                                  <p
                                    className="group inner list-group-item-text pstyle d1"
                                    style={{
                                      fontSize: "large",
                                      backgroundColor: "#f0f0f0",
                                      height: "1.5em",
                                      borderRadius: "4px",
                                      marginBottom: "0.5em",
                                    }}
                                  >
                                    &nbsp;
                                  </p>
                                  <p
                                    className="group inner list-group-item-text d4"
                                    style={{
                                      backgroundColor: "#f0f0f0",
                                      height: "2em",
                                      borderRadius: "4px",
                                      marginBottom: "0.5em",
                                    }}
                                  >
                                    &nbsp;
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
                                      type="button"
                                      disabled
                                      style={{ opacity: 0.5 }}
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
                ))
              ) : undefined !== dperaturan && 0 < dperaturan.length ? (
                dperaturan.map((d) => {
                  return (
                    <section
                      className={
                        listClick
                          ? "dataLoad col-12 col-md-6 col-lg-4 mt-3"
                          : "dataLoad col-12 col-md-12 mt-3"
                      }
                      key={d.idperaturan}
                      id={d.idperaturan}
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
                                        d.jns,
                                        d.no_peraturan,
                                        d.tahun,
                                        d.tentang
                                      )
                                    }
                                  >
                                    <p
                                      className="group inner list-group-item-text pstyle d1"
                                      style={{ fontSize: "large" }}
                                    >
                                      {d.nama_jenis.toUpperCase()} NOMOR{" "}
                                      {d.no_peraturan} TAHUN {d.tahun}
                                    </p>
                                    <p className="group inner list-group-item-text d4">
                                      {d.tentang.toLowerCase()}
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
            {(isLoadingData ||
              (undefined !== dperaturan && 0 < dperaturan.length)) &&
              totalRecord > 10 && (
                <>
                  <Pagination
                    itemClass="page-item"
                    linkClass="page-link waves-effect"
                    activePage={currentPage}
                    activeLinkClass="page-link active"
                    itemsCountPerPage={10}
                    totalItemsCount={totalRecord}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                  />
                </>
              )}
          </div>

          <div className="col-lg-3 col-md-0 mt-3 leftFilter">
            <form id="filter_move" onSubmit={(e) => e.preventDefault()}>
              <input type="hidden" id="jml_j" />
              <input type="hidden" id="jml_t" />
              <div className="filter-jdih-header" id="h_jenis">
                Jenis Peraturan
              </div>
              <div
                id="spk_jns"
                style={{ display: showSepokjns ? "block" : "none" }}
              >
                <div className="md-form form-sm mt-0 mb-2 pr-0 pl-0 sepokDrawer">
                  <i
                    className="fas fa-search icn_cari"
                    aria-hidden="true"
                    suppressHydrationWarning
                  ></i>
                  <input
                    type="text"
                    id="sepokjenis"
                    placeholder="Cari Jenis Peraturan..."
                    onChange={handleChangejenis}
                    className="search_boxtable"
                    autoComplete="off"
                    style={{ textTransform: "uppercase" }}
                  />
                  <i
                    className="fas fa-times close_cari"
                    suppressHydrationWarning
                    onClick={handleCloseJenis}
                  ></i>
                </div>
              </div>
              <div className="container pl-0 pr-0" id="listJns">
                {djenis &&
                  djenis.map((item) => (
                    <label className="option_item" key={item.jns} id={item.jns}>
                      <input
                        type="checkbox"
                        className="checkbox chckjenis"
                        name="jns[]"
                        value={item.jns}
                      />
                      <div className="option_inner _jdih">
                        <div className="tickmark"></div>
                        <div className="name">{item.jns}</div>
                      </div>
                    </label>
                  ))}
              </div>
              <div
                className="pl-0 pr-0"
                id="listJnsCari"
                style={{ display: showlistJnsCari ? "block" : "none" }}
              >
                {listJnsCariArray.length ? (
                  listJnsCariArray.map((ar, i) => {
                    return <div key={i * 2}>{ar}</div>;
                  })
                ) : (
                  <p className="pcarikosong">Jenis Yang Anda Cari Tidak Ada</p>
                )}
              </div>
              <div style={{ clear: "both" }}></div>
              <div
                className="filter-jdih-section__toggle"
                style={{ display: showMejns ? "block" : "none" }}
                id="liak_jns"
                onClick={handleClicklbhjenis}
              >
                Lihat Lebih <i className="fas fa-arrow-down"></i>
              </div>
              <div className="filter-jdih-header" id="h_tahun">
                Tahun Peraturan
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
                      key={item.tahun}
                      id={item.tahun}
                    >
                      <input
                        type="checkbox"
                        className="checkbox chcktahun"
                        name="thn[]"
                        value={item.tahun}
                      />
                      <div className="option_inner _jdih">
                        <div className="tickmark"></div>
                        <div className="name glrthn">{item.tahun}</div>
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
              <div className="filter-jdih-header col-12">
                Status{" "}
                <span className="resetItem" id="resetTgl">
                  Reset
                </span>
              </div>
              <div className="md-form form-sm ml-2 mr-1 mt-0 mb-2 pr-2 pl-0 sepokDrawer col-12 inputModifAll stt">
                <select className="browser-default custom-select" id="status">
                  <option value="">--Pilih Status--</option>
                  <option value="Dicabut">Dicabut</option>
                  <option value="Diubah">Diubah</option>
                  <option value="Mencabut">Mencabut</option>
                  <option value="Mengubah">Mengubah</option>
                  <option value="Uji_Materil">Uji Materil</option>
                </select>
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

export async function getJenis(Lmt) {
  const response = await axiosInstance.get("/api/hukumproduk/jenis?lmt=" + Lmt);
  if (response.status === 500) {
    return { result: { data: "", jml: "" } };
  } else {
    const resx = response.data;
    return { result: resx };
  }
}

export async function cariJenis(qu) {
  const response = await axiosInstance.get("/api/hukumproduk/jnscari?vl=" + qu);
  if (response.status === 500) {
    return { result: [""] };
  } else {
    return { result: await response.data };
  }
}

export async function getTahun(Lmt) {
  const response = await axiosInstance.get("/api/hukumproduk/tahun?lmt=" + Lmt);
  if (response.status === 500) {
    return { result: { data: "", jml: "" } };
  } else {
    return { result: await response.data };
  }
}

export async function cariTahun(qu) {
  const response = await axiosInstance.get("/api/hukumproduk/thncari?vl=" + qu);
  if (response.status === 500) {
    return { result: [] };
  } else {
    return { result: await response.data };
  }
}

export async function getPeraturan(
  plh,
  loc,
  srh,
  crnPg,
  lmtDt,
  checkJ,
  checkT,
  sttx
) {
  let tentang = srh,
    p_lihan = plh,
    jns = checkJ
      ? typeof checkJ === "string"
        ? checkJ.split(",").filter(Boolean)
        : checkJ
      : [],
    thn = checkT
      ? typeof checkT === "string"
        ? checkT.split(",").filter(Boolean)
        : checkT
      : [],
    status = sttx,
    terx = loc,
    length = lmtDt,
    start = (crnPg - 1) * lmtDt;

  const resOpt = {
    tentang: tentang,
    p_lihan: p_lihan,
    jns: jns,
    thn: thn,
    status: status,
    terx: terx,
    length: length,
    start: start,
  };
  try {
    const res_p = await axiosInstance.post(
      "/api/hukumproduk/produkhukum",
      resOpt
    );
    const resx = res_p.data;
    return { result: resx };
  } catch (error) {
    console.error("Error in getPeraturan:", error);
    return { result: { data: "", jml: "" } };
  }
}

export async function getServerSideProps(context) {
  const { query } = context;
  let isiSearch, akukKhia;

  // Fix URL parsing logic
  if (
    !query.q ||
    query.q === "All" ||
    query.q === "Terbaru" ||
    query.q === "Terpopuler"
  ) {
    isiSearch = "";
    akukKhia = query.q || "All";
  } else {
    let isiData = query.q.split("/");
    akukKhia = isiData[0] || "All";
    if (isiData.length > 1) {
      isiSearch = isiData[1].split("+").join(" ").split("#").join("");
    } else {
      isiSearch = "";
    }
  }

  let jnsxx,
    thnxx,
    jnsxxPush = [],
    thnxxPush = [],
    sttxx,
    sttAtas,
    jns_unyinx = [],
    thn_unyinx = [],
    totalDjenis,
    totalDtahun,
    pagexx;

  if (
    context.req &&
    context.req.headers &&
    context.req.headers.cookie &&
    cookie
  ) {
    try {
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

      if (prse.stt !== "" && prse.stt !== undefined) {
        sttxx = prse.stt;
      } else {
        sttxx = "";
      }

      if (prse.stsstt !== "" && prse.stsstt !== undefined) {
        sttAtas = prse.stsstt;
      } else {
        sttAtas = "semua";
      }

      if (prse.jns_unyin !== "" && prse.jns_unyin !== undefined) {
        const pchx_j = prse.jns_unyin.split(",");
        for (let ju = 0; ju < pchx_j.length; ju++) {
          jns_unyinx.push({ jns: pchx_j[ju] });
        }
      } else {
        jns_unyinx.push("");
      }

      if (prse.thn_unyin !== "" && prse.thn_unyin !== undefined) {
        const pchx_t = prse.thn_unyin.split(",");
        for (let jt = 0; jt < pchx_t.length; jt++) {
          thn_unyinx.push({ tahun: pchx_t[jt] });
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
    } catch (error) {
      console.error("Cookie parsing error:", error);
      jnsxx = "";
      thnxx = "";
      sttxx = "";
      sttAtas = "semua";
      jns_unyinx = [""];
      thn_unyinx = [""];
      totalDjenis = 0;
      totalDtahun = 0;
      pagexx = 1;
    }
  } else {
    jnsxx = "";
    thnxx = "";
    sttxx = "";
    sttAtas = "semua";
    jns_unyinx = [""];
    thn_unyinx = [""];
    totalDjenis = 0;
    totalDtahun = 0;
    pagexx = 1;
  }

  let dataJenis, jml_j, dataTahun, jml_t;

  if (jns_unyinx.length > 1) {
    dataJenis = jns_unyinx;
    jml_j = totalDjenis;
  } else {
    const dataJenisJml = await getJenis(0);
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
        destination: "/produk-hukum/All",
        permanent: false,
      },
    };
  }

  const [srchx, peraturans] = await Promise.all([
    isiSearch,
    getPeraturan(sttAtas, akukKhia, isiSearch, pagexx, 10, jnsxx, thnxx, sttxx),
  ]);

  return {
    props: {
      data: {
        srchx,
        peraturans,
        dataJenis,
        jml_j,
        dataTahun,
        jml_t,
        jnsxx,
        thnxx,
        sttxx,
        sttAtas,
        pagexx,
      },
    },
  };
}

export default Peraturan;
