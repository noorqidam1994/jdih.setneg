import { db, collection, doc, setDoc } from "../lib/clientApp";
import axiosInstance from "../lib/axiosInstance";

const dwlviewRef = collection(db, "hasil_survei");

export async function addSurvei({ dataid }) {
  if (dataid.ket === "Add") {
    let idx = `${dataid.user_email + dataid.ip_user}`;
    await setDoc(doc(dwlviewRef, idx), {
      idsurvei: dataid.idsurvei,
      ip_user: dataid.ip_user,
      wilayah: dataid.wilayah,
      user_email: dataid.user_email,
      user_nama: dataid.user_nama,
      poin: dataid.poin,
    });
    return dataid;
  } else {
    await axiosInstance.get("/api/survei").then(function (selct) {
      return selct.data;
    });
  }
}
