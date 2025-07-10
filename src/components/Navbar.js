import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import cookiee from "js-cookie";

const Navbar = () => {
  const router = useRouter();
  const lctx = router.asPath.slice(1).split("/");

  useEffect(() => {
    if (
      lctx[0] === "produk-hukum" &&
      (lctx[1] === "" || lctx[1] === undefined)
    ) {
      router.push("/produk-hukum/All", undefined, { shallow: true });
    }
  }, [router.asPath]);

  // Function to handle cookie setting for menu navigation
  const handleMenuCookies = (category) => {
    let arrJns = [];
    cookiee.set("jns_x", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("thn_x", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("inji_jns", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("jns_unyin", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("thn_unyin", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("totalDjenis", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("totalDtahun", "", { secure: true, expires: 7, path: "/" });
    cookiee.set("akuksearch", "");

    return arrJns;
  };

  const handleClickMenuNav = (category, targetPath) => {
    const arrJns = handleMenuCookies(category);

    // Map categories to their respective filter values
    const categoryMap = {
      Peraturan: ["PERPU", "PP", "PERPRES", "PERMENSESNEG"],
      Keputusan: ["KEPRES", "KEPMENSESNEG"],
      Instruksi: ["INPRES"],
      "Surat Edaran": ["SURAT EDARAN"],
      PKS: ["PKS"],
      MOU: ["MOU"],
      MA: ["Putusan MA"],
      MK: ["Putusan MK"],
      Pengadilan: ["Putusan Pengadilan"],
      Bawaslu: ["Putusan Bawaslu"],
      KIP: ["Putusan KIP"],
      Yurisprudensi: ["Yurisprudensi"],
      Buku: ["Buku Hukum"],
      Naskah: ["Naskah Akademik"],
      Analisa: ["Analisa dan Evaluasi"],
      Kajian: ["Kajian Penelitian"],
      Himpunan: ["Himpunan"],
      Rancangan: ["Rancangan PUU"],
      Risalah: ["Risalah Rapat"],
      Skripi: ["Skripi/Tesis/Desertasi"],
      Hukum: ["Artikel Hukum"],
      Ilmiah: ["Artikel Ilmiah"],
      Tulis: ["Karya Tulis"],
      Koran: ["Kliping Koran"],
    };

    if (categoryMap[category]) {
      arrJns.push(...categoryMap[category]);
      cookiee.set("inji_jns", arrJns.join(","), {
        secure: true,
        expires: 7,
        path: "/",
      });
      cookiee.set("jns_x", arrJns.join(","), {
        secure: true,
        expires: 7,
        path: "/",
      });
    } else if (category === "ebook") {
      cookiee.set("inji_jns", "", { secure: true, expires: 7, path: "/" });
      cookiee.set("jns_x", "", { secure: true, expires: 7, path: "/" });
    }

    // Check if we're already on the target path
    const currentPath = router.asPath.split("?")[0]; // Remove query parameters
    if (currentPath === targetPath) {
      // If we're on the same page, force a page refresh to apply the new filters
      window.location.reload();
      return false; // Prevent Link navigation
    }

    return true; // Allow Link navigation
  };

  return (
    <header
      id="header"
      className="header mask d-flex align-items-center sticky-top"
    >
      <div className="container position-relative d-flex align-items-center">
        <div className="logo d-flex align-items-center me-auto">
          <a href="https://jdihn.go.id/" target="blank">
            <img src="/img/jdihn.png" className="imgAtas" alt="" />
          </a>
          <a href="https://www.setneg.go.id/" target="blank">
            <img src="/img/lambang.png" className="imgAtas" alt="" />
          </a>
          <span className="glrKemen">
            Kementerian Sekretariat Negara
            <br />
            Republik Indonesia
          </span>
        </div>
        <nav id="navmenu" className="navmenu">
          <ul>
            <li>
              <Link href="/">Beranda</Link>
            </li>
            <li className="dropdown">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <span>Tentang Kami</span>{" "}
                <i className="bi bi-chevron-down toggle-dropdown"></i>
              </a>
              <ul>
                <li>
                  <Link href="/tentang?q=visi_misi" as="/tentangkami/visi_misi">
                    Visi Misi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tentang?q=dasar_hukum"
                    as="/tentangkami/dasar_hukum"
                  >
                    Dasar Hukum
                  </Link>
                </li>
                <li>
                  <Link href="/tentang?q=struktur" as="/tentangkami/struktur">
                    Struktur Organisasi
                  </Link>
                </li>
                <li>
                  <Link href="/tentang?q=tentang" as="/tentangkami/tentang">
                    Tentang JDIH
                  </Link>
                </li>
                <li>
                  <Link href="/tentang?q=sop" as="/tentangkami/sop">
                    SOP JDIH
                  </Link>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <span>Produk Hukum</span>{" "}
                <i className="bi bi-chevron-down toggle-dropdown"></i>
              </a>
              <ul>
                <li className="dropdown">
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <span>Peraturan/Instrumen</span>{" "}
                    <i className="bi bi-chevron-down toggle-dropdown"></i>
                  </a>
                  <ul>
                    <li>
                      <Link
                        href="/produk-hukum/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Peraturan",
                              "/produk-hukum/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Peraturan
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/produk-hukum/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Keputusan",
                              "/produk-hukum/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Keputusan
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/produk-hukum/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Instruksi",
                              "/produk-hukum/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Instruksi
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/produk-hukum/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Surat Edaran",
                              "/produk-hukum/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Surat Edaran
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/produk-hukum/All"
                        onClick={(e) => {
                          if (!handleClickMenuNav("PKS", "/produk-hukum/All")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        PKS
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/produk-hukum/All"
                        onClick={(e) => {
                          if (!handleClickMenuNav("MOU", "/produk-hukum/All")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        MOU
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <span>Putusan Pengadilan</span>{" "}
                    <i className="bi bi-chevron-down toggle-dropdown"></i>
                  </a>
                  <ul>
                    <li>
                      <Link
                        href="/putusan-pengadilan/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav("MA", "/putusan-pengadilan/All")
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Putusan MA
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/putusan-pengadilan/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav("MK", "/putusan-pengadilan/All")
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Putusan MK
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/putusan-pengadilan/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Pengadilan",
                              "/putusan-pengadilan/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Putusan Pengadilan
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/putusan-pengadilan/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Bawaslu",
                              "/putusan-pengadilan/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Putusan Bawaslu
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/putusan-pengadilan/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "KIP",
                              "/putusan-pengadilan/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Putusan KIP
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/putusan-pengadilan/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Yurisprudensi",
                              "/putusan-pengadilan/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Yurisprudensi
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <span>Monografi Hukum</span>{" "}
                    <i className="bi bi-chevron-down toggle-dropdown"></i>
                  </a>
                  <ul>
                    <li>
                      <Link
                        href="/monografi-hukum/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav("Buku", "/monografi-hukum/All")
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Buku Hukum
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/monografi-hukum/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Naskah",
                              "/monografi-hukum/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Naskah Akademik
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/monografi-hukum/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Analisa",
                              "/monografi-hukum/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Analisa dan Evaluasi
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/monografi-hukum/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Kajian",
                              "/monografi-hukum/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Kajian Penelitian
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/monografi-hukum/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Himpunan",
                              "/monografi-hukum/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Himpunan
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/monografi-hukum/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Rancangan",
                              "/monografi-hukum/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Rancangan PUU
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/monografi-hukum/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Risalah",
                              "/monografi-hukum/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Risalah Rapat
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/monografi-hukum/All"
                        onClick={(e) => {
                          if (
                            !handleClickMenuNav(
                              "Skripi",
                              "/monografi-hukum/All"
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Skripi/Tesis/Desertasi
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="dropdown">
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <span>Artikel Hukum</span>{" "}
                    <i className="bi bi-chevron-down toggle-dropdown"></i>
                  </a>
                  <ul>
                    <li>
                      <Link
                        href="/artikel/All"
                        onClick={(e) => {
                          if (!handleClickMenuNav("Hukum", "/artikel/All")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Artikel Hukum
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/artikel/All"
                        onClick={(e) => {
                          if (!handleClickMenuNav("Ilmiah", "/artikel/All")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Artikel Ilmiah
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/artikel/All"
                        onClick={(e) => {
                          if (!handleClickMenuNav("Tulis", "/artikel/All")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Karya Tulis
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/artikel/All"
                        onClick={(e) => {
                          if (!handleClickMenuNav("Koran", "/artikel/All")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Kliping Koran
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#" onClick={(e) => e.preventDefault()}>
                <span>Informasi Lain</span>{" "}
                <i className="bi bi-chevron-down toggle-dropdown"></i>
              </a>
              <ul>
                <li>
                  <Link href="/infografis">Infografis</Link>
                </li>
                <li>
                  <Link href="/ebook">E-book</Link>
                </li>
                <li>
                  <Link href="/galeri">Galeri</Link>
                </li>
                <li>
                  <Link href="/grafikstatistik">Grafik Statistik</Link>
                </li>
                <li>
                  <Link href="/matriks">Matrik Peraturan</Link>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Lainnya
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/kontak">Kontak Kami</Link>
            </li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>
      </div>
      <button
        type="button"
        className="btn btn-danger btn-floating btn-sm waves-effect waves-light"
        id="btn-back-to-top"
      >
        <i
          className="fas fa-arrow-up"
          style={{ padding: "0 1.2rem 0 0", fontSize: "1.3rem" }}
        ></i>
      </button>
    </header>
  );
};

export default Navbar;
