import { db, collection, doc, setDoc } from "../lib/clientApp";
import axiosInstance from "../lib/axiosInstance";
import cookiee from "js-cookie";

const dwlviewRef = collection(db, "download_view");

export async function addOnline({ dataid }) {
  const arrUpdate = [];
  let idx;
  let cookiex;
  if (dataid.userId === undefined) {
    let randm = Math.random().toString(36).substr(2, 5);
    cookiee.set("userId", randm, { secure: true, expires: 7, path: "/" });
    cookiex = randm;
  } else {
    cookiex = dataid.userId;
  }
  if (dataid.keterangan === "lihat") {
    idx = `${dataid.idperaturan + dataid.browser}_${dataid.ip}${
      dataid.keterangan
    }${cookiex}`;
  } else if (dataid.keterangan === "suka" || dataid.keterangan === "tidak") {
    idx = `${dataid.idperaturan}_${dataid.user}`;
  } else {
    idx = `${dataid.idperaturan}_${dataid.ip}_${dataid.tanggal}_${dataid.jam}`;
  }
  await setDoc(doc(dwlviewRef, idx), {
    idperaturan: dataid.idperaturan,
    browser: dataid.browser,
    os: dataid.os,
    ip: dataid.ip,
    wilayah: dataid.wilayah,
    negara: dataid.negara,
    saat_ini: dataid.saat_ini,
    keterangan: dataid.keterangan,
    tanggal: dataid.tanggal,
    user: dataid.user,
    userId: dataid.userId,
  });

  arrUpdate.push({
    iddownloadview: idx,
    idperaturan: dataid.idperaturan,
    browser: dataid.browser,
    os: dataid.os,
    ip: dataid.ip,
    wilayah: dataid.wilayah,
    negara: dataid.negara,
    saat_ini: dataid.saat_ini,
    keterangan: dataid.keterangan,
    tanggal: dataid.tanggal,
    front_back: "1",
    user: dataid.user,
  });

  const resOpt = {
    arrData: arrUpdate,
    idperaturan: dataid.idperaturan,
    k: "StatusFooter",
  };
  const add = await axiosInstance.post("/api/hukumproduk/detaildata", resOpt);
  return await add.data;
}
