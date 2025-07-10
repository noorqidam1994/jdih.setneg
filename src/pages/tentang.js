import React, { useEffect, useState } from "react";
import Page from "../components/page";
import { server } from "../config";
import axiosInstance from "../lib/axiosInstance";

const Tentang = ({ data, title }) => {
  const ttl = title;
  const [mdata, setmdata] = useState(data);

  useEffect(() => {
    let el = document.createElement("div");
    el.innerHTML = mdata;
    el.querySelectorAll("img").forEach(async (imgEl) => {
      let j_img = imgEl.src.split("/").filter(Boolean);
      let jd_img = j_img[4] + "." + j_img[5];
      await fetch(`${server}/api/imgtinymce?img=` + jd_img, {
        method: "GET",
        headers: { Accept: "*/*" },
      })
        .then((response) => response.blob())
        .then((images) => {
          let outside = URL.createObjectURL(images);
          imgEl.src = outside;
          setmdata(el.innerHTML);
        })
        .catch(() => {
          // console.log(error)
        });
    });
  }, []);
  return (
    <div>
      <Page title={ttl}>
        <section className="awlAtsdibahbar mt-5 pt-5">
          <div className="card card-cascade narrower">
            <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white ml-0">
              <h5 className="h5-responsive mb-0 pl-2">{ttl}</h5>
            </div>
            <div className="card-body pt-4 pr-0 pl-0 pb-0">
              <div
                className="col-xl-12 col-lg-12 col-md-12 row pt-3"
                style={{ textAlign: "justify", textJustify: "newspaper" }}
              >
                {"" != data ? (
                  <div
                    style={{ textAlign: "left" }}
                    dangerouslySetInnerHTML={{ __html: mdata }}
                  ></div>
                ) : (
                  <p>{ttl} Masih Kosong</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </Page>
    </div>
  );
};

export async function getServerSideProps(context) {
  try {
    const { query } = context;
    const getcnt = query.q;

    // Calculate title based on the query parameter
    let title;
    if (getcnt == "visi_misi") {
      title = "Visi Misi";
    } else if (getcnt == "dasar_hukum") {
      title = "Dasar Hukum";
    } else if (getcnt == "struktur") {
      title = "Struktur Organisasi";
    } else if (getcnt == "tentang") {
      title = "Tentang JDIH";
    } else if (getcnt == "sop") {
      title = "SOP JDIH";
    } else {
      title = "Tentang";
    }

    // Validate the query parameter
    if (!getcnt) {
      return { props: { data: "", title: "Tentang" } };
    }

    const resOpt = { ket: getcnt };
    const response = await axiosInstance.post("/api/tentang", resOpt);
    const isidata = await response.data;

    let is_data;
    if (!isidata || !isidata[getcnt]) {
      is_data = "";
    } else {
      is_data = isidata[getcnt];
    }

    return { props: { data: is_data, title: title } };
  } catch (error) {
    console.error("Error fetching tentang data:", error);
    // Return empty data if API call fails
    return { props: { data: "", title: "Tentang" } };
  }
}

export default Tentang;
