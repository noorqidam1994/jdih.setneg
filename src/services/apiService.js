import axiosInstance from "../lib/axiosInstance";

export const apiService = {
  async getYearRegulations(arrID) {
    const requestOptions = {
      ket: "dibah",
      arrID: arrID,
    };
    
    try {
      const response = await axiosInstance.post("/api/hukumproduk/apimatriks", requestOptions);
      
      if (response.status === 500) {
        return { result: { data: [] } };
      }
      
      const data = await response.data;
      let processedData;
      
      if (data.data !== undefined && data.data.length > 0) {
        const groupedMap = data.data.reduce(
          (entryMap, item) =>
            entryMap.set(item.tahun, [...(entryMap.get(item.tahunclea) || []), item]),
          new Map()
        );
        processedData = Array.from(groupedMap).map(([name, value]) => ({ name, value }));
      }
      
      const limitedData = processedData?.slice(0, 20);
      return { result: limitedData };
    } catch (error) {
      console.error("Error fetching year regulations:", error);
      return { result: { data: [] } };
    }
  },

  async getRegulations(
    pilihan,
    lokasi,
    search,
    currentPage,
    limitData,
    jenisCheck,
    tahunCheck,
    status
  ) {
    const start = (currentPage - 1) * limitData;
    
    const requestOptions = {
      tentang: search,
      p_lihan: pilihan,
      jns: jenisCheck,
      thn: tahunCheck,
      status: status,
      terx: lokasi,
      length: limitData,
      start: start,
    };
    
    try {
      const response = await axiosInstance.post(
        "/api/hukumproduk/produkhukum",
        requestOptions
      );
      
      if (response.status === 500) {
        return { data: "", jml: "" };
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching regulations:", error);
      return { data: "", jml: "" };
    }
  },

  async getMatrixData() {
    const requestOptions = {
      ket: "hadap",
    };

    try {
      const response = await axiosInstance.post(
        "/api/hukumproduk/apimatriks",
        requestOptions
      );
      return await response.data;
    } catch (error) {
      console.error("Error fetching matrix data:", error);
      throw error;
    }
  },

  async getGalleryData() {
    try {
      const response = await axiosInstance.post("/api/galeri/data_glr", {
        ket: "",
      });
      return await response.data;
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      return [];
    }
  },

  async getEbookData() {
    try {
      const response = await axiosInstance.get("/api/ebook/listebook", { k: "" });
      return await response.data;
    } catch (error) {
      console.error("Error fetching ebook data:", error);
      return { data: [], jml: 0 };
    }
  }
};