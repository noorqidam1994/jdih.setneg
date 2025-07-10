import React, { useState, useEffect } from 'react';
import dynamic from "next/dynamic"
import Page from '../components/page';
import { server } from '../config';
import moment from 'moment';
import CustomLoadingScreen from '../components/Loading-screeen';
import axiosInstance from '../lib/axiosInstance';

const ReactImageVideoLightbox = dynamic(() => import("../public/imagevideo"), { ssr: false })

const Galeri = ({ data }) => {
    const [showLoading, setShowLoading] = useState(false);
    const [listGaleri, setlistGaleri] = useState([]);
    const [lightboxOpen, setlightboxOpen] = useState(false);
    let idLocale = require('moment/locale/id');
    moment.updateLocale('id', idLocale);

    useEffect(() => {
    data.forEach(function(x){
        x.img.forEach(function(i){
            listImages(i.file, x.id, i.ext)
        });
    });
    }, []);

    function listImages(f, fl, ext, img1) {
        fetch(`${server}/api/galeri/cariimg?img=`+f+`&fl=`+fl+`&v=`+ext, {
            method: 'GET',
            headers: { 'Accept': '*/*' }
        })
        .then(response => response.blob())
        .then(images => {
            let outside = URL.createObjectURL(images)
            if (ext === "photo") {
            let img = document.createElement('img');
            img.src = outside;
            img.id = ext
            document.getElementById(fl).appendChild(img);
            } else {
            let vid = document.createElement('video');
            vid.src = outside;
            vid.id = ext;
            document.getElementById(fl).appendChild(vid);
            }
        })
        .catch(error => {
            // console.log(error)
        })
    }

    function clickDetailEvent(id) {
        const imgs = document.getElementById(id).getElementsByTagName("img");
        const vids = document.getElementById(id).getElementsByTagName("video");
        const allImgs = [];
        imgs.forEach(img => 
            allImgs.push({url: img.src, type: img.id, altTag: ""})
        );
        vids.forEach(vid => 
            allImgs.push({url: vid.src, type: vid.id, altTag: ""})
        );
        setlistGaleri(allImgs);
        setlightboxOpen(true);
    }

    return(
        <div>{showLoading && (<CustomLoadingScreen />)}
        <Page title="Galeri">
        <section className="awlAtsdibahbar mt-5 pt-5">
        <div className="card card-cascade narrower">
        <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
        <h5 className="h5-responsive mb-0 pl-2">Galeri</h5>
        </div>
        <div className="card-body pt-0 pr-0 pl-0 pb-0">
        <div className="col-xl-12 col-lg-12 col-md-12 row">
        {data.length ? data.map((g, i) => (
        <div className="card col-xl-3 col-lg-3 col-md-4 mb-3 mt-3 g_leri" key={i}>
        <div className="view overlay" id="photos" onClick={() => clickDetailEvent(g.id)}>
        <div id={g.id} ></div>
        <a href="#" onClick={(e) => e.preventDefault()}>
        <div className="mask rgba-white-slight waves-effect waves-light"></div>
        </a>
        </div>
        <div className="card-body pt-0 pl-2 pr-2 pb-0" style={{background: '#e3e7e7'}}>
        <h6 className="card-title text-center mb-0">{g.judul}</h6>
        </div>
        <div className="rounded-bottom mdb-color lighten-3 text-center text-white numbersxx">
        <i className="far fa-clock pr-1"></i>{moment(g.tgl).format('LLL')}
        </div>
        </div>
        )) : <h5 className="mt-4 col-md-12 text-center">Data Galeri Kosong...</h5>}
        </div>
        </div>
        </div>
        </section>
        {lightboxOpen && (
            <ReactImageVideoLightbox
              data={listGaleri}
              startIndex={0}
              showResourceCount={true}
              onCloseCallback={() => setlightboxOpen(false)}
              onNavigationCallback={(currentIndex) =>
                console.log()
              }
            />
          )}
        </Page>
        </div>
    )
}

export async function getServerSideProps(context) {
      const resOpt = {
            ket: ''
        }
    const response = await axiosInstance.post('/api/galeri/data_glr', resOpt);
    const isidata = await response.data;

    let xisidata
    if(isidata.status === 500) {
        return {
            redirect: {
              destination: '/',
              permanent: false,
            }
          }
    } else {
        xisidata = isidata;
    }
    return { props: { data: xisidata } };
}

export default Galeri