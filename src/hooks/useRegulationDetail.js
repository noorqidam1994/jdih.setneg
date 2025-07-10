import { useRouter } from "next/router";
import { cookieManager } from "../utils/cookieManager";

export const useRegulationDetail = () => {
  const router = useRouter();

  const handleRegulationDetail = (jenis, nomorPeraturan, tahun) => {
    const formattedNumber = nomorPeraturan.split("/").join("+");
    
    cookieManager.setSearchCookie("akuksearch", "");
    cookieManager.setSearchCookie("stsstt", "Semua");
    
    router.push(`/detailperaturan?q=${jenis}/${formattedNumber}/${tahun}`);
  };

  return {
    handleRegulationDetail,
  };
};