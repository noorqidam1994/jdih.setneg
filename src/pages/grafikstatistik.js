import React, { useEffect, useState  } from 'react';
import dynamic from 'next/dynamic'
import Page from '../components/page';

const AmChartComponent = dynamic(() => import("../components/Matrikchart"), {
  ssr: false
});
import axiosInstance from '../lib/axiosInstance'; 

const Grafikstatistik = ({ data }) => {
    const [headtable, setheadtable] = useState(data.atsHead.data)
    const [readDatatable, setreadDatatable] = useState(data.isiTable.result)
    console.log(headtable)
    return (
        <Page title="Grafik Statistik">
        <section className="pt-4">
        <div className="row row ml-2 mr-2" style={{overflowX:'auto'}}>
          <AmChartComponent dchart={{readDatatable, headtable}} />
        </div>
        </section>
        </Page>
      )
}

export async function getTahunPeraturan(arrID) {
  const resOpt = {
      ket: 'dibah', 
      arrID: arrID 
  };
  const res_p = await axiosInstance.post('/api/hukumproduk/apimatriks', resOpt);
  if(res_p.status === 500) {
    return { result: { data: [] } }
  } else {
    const isi = await res_p.data;
    let jdisi;
    if (isi.data !== undefined || isi.data.length > 0) {
      const groupedMap = isi.data.reduce(
        (entryMap, e) => entryMap.set(e.tahun, [...entryMap.get(e.tahun)||[], e]),
        new Map()
      )
      jdisi = Array.from(groupedMap).map(([name, value]) => ({name, value}))
    }
    let limitData = jdisi.slice(0,20)
    return { result: limitData }
  }
}

export async function getServerSideProps(context) {
  let isiSearch = '', isiSelect = 'semua';
  const arrID = [];
  const resOpt = { 
      ket: 'atas'
  };
    const response = await axiosInstance.post('/api/hukumproduk/apimatriks', resOpt);
    const atsHead = await response.data;
    if (atsHead.data.length === 0) {
      return {
        redirect: {
          destination: '/grafikstatistik',
          permanent: false,
        }
      }
    }
    for (let item of atsHead.data) {
      arrID.push(item.idjenis)
    }
    const isiTable = await getTahunPeraturan(arrID)
  return { props: { data: { atsHead, isiTable, isiSearch, isiSelect } } };
}

export default Grafikstatistik