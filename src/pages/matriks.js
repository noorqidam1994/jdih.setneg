import React, { useEffect, useState  } from 'react';
import { useRouter } from 'next/router';
import Page from '../components/page';
import axiosInstance from '../lib/axiosInstance';

const Matriks = ({ data }) => {
    const [headtable] = useState(data.atsHead.data)
    const [readDatatable] = useState(data.isiTable.result)
console.log(data)
    useEffect(() => {
        headtable.forEach((ex, ix) => {
          let tot = sumTotal(ix + 1)
          document.getElementById("sum_"+ix).innerHTML = tot
        });
    }, []);

    function sumTotal(index) {
      let tds = document.querySelectorAll('tbody tr'), sumVal = 0;
      for(let i = 0; i < tds.length; ++i) {
        let value = sumVal + parseInt(tds[i].childNodes[index].textContent * 1);
        if (!isNaN(value)) {
          sumVal = value;
        }
      }
      return sumVal;
    }

    return (
        <Page title="Matriks">
        <section className="mt-5 pt-5 tabsmatrix">
        <div className="row row ml-2 mr-2" style={{overflowX:'auto'}}>
        {0 < headtable.length ?
          <table className="table" id="sumtable">
          <thead className="thead-inverse">
          <tr>
          <th>TAHUN</th>
          {headtable.map( (d, k) => {
            return (<th key={k}>{d.jns}</th>)
          })}
          </tr>
          </thead>
          <tbody>
          {readDatatable.map( (data, index) => {
            return (
              <tr key={index}>
              <th>{data.name}</th>
              {headtable.map( (dx, kx) => {
              let jd = 0;
              data.value.map((item, i) => {
                if(item.idjenis === dx.idjenis) {
                  jd = item.jml
                }
              })
              return(<td key={kx}><span className="tooltipx" data-original-title={`${dx.jns} ${data.name}/${jd}`}>{jd}</span></td>)
              })}
              </tr>
            )
          })}
          </tbody>
          <tfoot>
          <tr>
          <th>TOTAL</th>
          {headtable.map( (d, i) => {
          return (<th key={i} id={`sum_${i}`}></th>)
          })
          }
          </tr>
          </tfoot>
          </table>
          : <h5 className="mt-4 col-md-12 text-center">Matriks Peraturan Masih Kosong...</h5>
          }
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
          destination: '/produk-hukum/All',
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

export default Matriks