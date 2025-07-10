import React , { useEffect, useState, useRef }from 'react';
import PageContainer from './Page-container.js';
import Header from './Navbar';
import Footer from './Footer';
import { db, collection, query, where, getDocs, onSnapshot } from "../lib/clientApp";
import moment from 'moment';
import { addSurvei } from '../components/surveiKuesi';
import axiosInstance from '../lib/axiosInstance';

 function Page({ title, children }) {
  let idLocale = require('moment/locale/id');
  moment.updateLocale('id', idLocale);
  const canvas = useRef();
  const [ hitCounter, sethitCounter ] = useState([{onlinehit: 0, lihathit: 0, unduhhit: 0, sukahit: 0, tidakhit: 0}])
  const [ injiCounter, setinjiCounter ] = useState(false)
  const [ injiSurvei, setinjiSurvei ] = useState(false)
  const [ injiWilayah, setinjiWilayah ] = useState()
  const [ injiIp, setinjiIp ] = useState()
  const [ dataSurveipert, setdataSurveipert] = useState([])
  const [validNama, setvalidNama] = useState('');
  const [validEmail, setvalidEmail] = useState('');
  const [valNama, setvalNama] = useState('');
  const [valEmail, setvalEmail] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [datagrafikPie, setDatagrafik] = useState(false);
  const [ yaPercentage, setyaPercentage ] = useState('');
  const [ cukupPercentage, setcukupPercentage ] = useState('');
  const [ tidakPercentage, settidakPercentage] = useState('');
  
  useEffect(() => {
    const dwlviewRef = collection(db, "download_view");
    const q = query(dwlviewRef);
    const unsubscribe = onSnapshot(q, (colSnapshot) => {
      if(colSnapshot !== undefined) {
          const resOpt = {
              k: 'SelectCounter'
          }
          axiosInstance.post('/api/hukumproduk/detaildata', resOpt)
          .then(response => {
            let json = response.data
            if (json.row !== undefined) {
              sethitCounter(json.row)
            } 
          })
          .catch(error => {
            console.error('Error updating hit counter:', error);
          }); 
        }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const dwlviewRef = collection(db, "hasil_survei");
    const q = query(dwlviewRef);
    const unsubscribe = onSnapshot(q, (colSnapshot) => {
      if(colSnapshot !== undefined) {
          const resOpt = {
              k: 'SelectFooter'
            }
          axiosInstance.post('/api/survei', resOpt)
          .then(response => {
            let json = response.data
            if (json.row.length > 0) {
              setDatagrafik(true)
              caharPie(json.row)
            } 
          })
          .catch(error => {
            console.error('Error updating survey data:', error);
          }); 
        }
    });
    return () => unsubscribe();
  }, []);

  async function getUpdate(x) {
    const arrUpdate = []
    let tgl = moment(new Date()).format("YYYY-MM-DD");
    const qx = query(
      collection(db, "download_view"),
      where("tanggal", "<", tgl),
      where("keterangan", "==", "lihat"),
      where("saat_ini", "==", "1"),
    );
    const querySnapshot = await getDocs(qx);
    if(querySnapshot !== undefined) {
    querySnapshot.forEach((doc) => {
      if (doc.id.length > 0) {
        arrUpdate.push({
          iddownloadview: doc.id,
          idperaturan: doc.data().idperaturan,
          browser: doc.data().browser,
          os: doc.data().os,
          ip: doc.data().ip,
          wilayah: doc.data().wilayah,
          negara: doc.data().negara,
          saat_ini: '0', 
          keterangan: 'lihat',
          tanggal: doc.data().tanggal,
          front_back: '1',
          user: ''
        })
      }
    });
    const resOpt = { 
        arrData: arrUpdate,
        idperaturan: '',
        k: 'StatusFooter'
    }
    await axiosInstance.post('/api/hukumproduk/detaildata', resOpt);
  }
  }
  
  // useEffect(async () => {
  //   const geoL = await axios(`https://ipinfo.io/json?token=5f3dc85d5516ab`);
  //   const geoLoc = await geoL.data;
  //   setinjiWilayah(`${geoLoc.city}/${geoLoc.region}`)
  //   setinjiIp(geoLoc.ip)
  //   addSurvei({ dataid: {ket: 'akuk' } })
  //   .then(datsurvei => {
  //     setdataSurveipert(datsurvei.dataSl)
  //   })
  //   setProgressBar(1);
  //   if(cookiee.get('m_survei') === undefined && dataSurveipert > 0) {
  //     cookiee.set('m_survei', 'show')
  //     $('#modalSurvei').modal('toggle');
  //   }
  //   let autosize = document.getElementsByClassName('noscrollbars')[0];
  //   addEvent(autosize, ['change', 'cut', 'paste', 'keydown' ], e => resize(autosize));
  //   $('.tooltipx').tooltip();
  //   $(window).on("scroll", function () {
  //     let shouldBeVisible = $(window).scrollTop() > 200;
  //     shouldBeVisible ? setShowButton(true) : setShowButton(false);
  //   });
  //   $('#modalGrafikKuesi').on('hidden.bs.modal', function (e) {
  //     $("#isiKuesi").detach().appendTo(".injikhangni");
  //   });
  // }, []);


  function caharPie(dataset) {
    if (dataset.length > 0) {
      let dataTotal = dataset.reduce((acc, data) => (acc += data.count), 0);
      let yaCalculate = (dataset[0].count / dataTotal) * 100;
      let cukupCalculate = (dataset[1].count / dataTotal) * 100;
      let tidakCalculate = (dataset[2].count / dataTotal) * 100;
      let yaPercentage = `${yaCalculate.toFixed(0)}%`;
      let cukupPercentage = `${cukupCalculate.toFixed(0)}%`;
      let tidakPercentage = `${tidakCalculate.toFixed(0)}%`;
      setyaPercentage(yaPercentage);
      setcukupPercentage(cukupPercentage);
      settidakPercentage(tidakPercentage);
      }
  }

  function addEvent(el, types, fn) {
    if (typeof types === 'string') types = [ types ];
    if(el !== undefined)
    types.forEach(type => el.addEventListener(type, fn));
  }

  function resize(ara) {
    ara.style.height = 'auto';
    ara.style.height = ara.scrollHeight + 'px';
  }

  const scrollToTop = () => {
    $("html, body").animate({ scrollTop: 0 }, 1000);
  };

  const clickDrawerhit = () => {
      if (injiCounter) {
        setinjiCounter(false)
      } else {
        setinjiCounter(true)
        setinjiSurvei(false)
      }
  }

  const clickDrawersurvei = () => {
    if (injiSurvei) {
      setinjiSurvei(false)
    } else {
      setinjiCounter(false)
      setinjiSurvei(true)
    }
  }

  const changeNama = n => {
    n.preventDefault();
    if(n.target.value === '') {
        setvalidNama('Nama Lengkap Masih Kosong!!');
        setvalNama('');
    } else {
        setvalidNama('');
        setvalNama(n.target.value);
    }
}

const changeEmail = e => {
  e.preventDefault();
  let regEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  if(e.target.value === '' || !regEmail.test(e.target.value)) {
      setvalidEmail('Format Email Salah');
      setvalEmail(e.target.value);
  } else {
      setvalidEmail('');
      setvalEmail(e.target.value);
  }
}

const clickNextSteps = () => {
  if (valNama !== '' && valEmail !== '') {
    $("#progressbar li").eq(1).addClass("active");
    setProgressBar(2)
    $("fieldset").eq(0).css("display", "none");
    $("fieldset").eq(1).css("display", "block");
    $('#modalSurvei .btnNext').css('display', 'none')
    $('#modalSurvei .btnPrev').css('display', 'block')
    $('#modalSurvei .btnSubmit').css('display', 'block')
    
  } else {
    setvalidNama('Nama Lengkap Masih Kosong!!');
    setvalidEmail('Format Email Salah');
  }
}

const clickPrevSteps = () => {
  $("#progressbar li").eq(0).addClass("active");
  $("fieldset").eq(1).css("display", "none");
  $("fieldset").eq(0).css("display", "block");
  $('#modalSurvei .btnNext').css('display', 'block')
  $('#modalSurvei .btnPrev').css('display', 'none')
  $('#modalSurvei .btnSubmit').css('display', 'none')
}

const clickSubmitSteps = async () => {
  const arryRadio = []
  let radiCheck = $('input[type=radio].custom-control-input:checked');
  let jmlCheck = $('input[type=radio].custom-control-input');
  $(jmlCheck).each(function(i){
    arryRadio.push($(this).attr('name'))
  })
  const realArray = [...new Set(arryRadio)]
  realArray.forEach((v, i) => {
    if($("input:radio[name="+v+"]:checked").length == 0) {
      $('#salah'+v).css('display', 'block')
    } else {
      $('#salah'+v).css('display', 'none')
    }
  })
  let catatan = $('textarea[name="catatansurvei"]').val();
  let tgl = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const jwb = []
  $(radiCheck).each(function(i){
    let value = $(this).val()
    jwb.push(value)
  });
  if(radiCheck.length === realArray.length) {
    const postdata = {
      idsurvei: realArray,
      tanggal_survei: tgl,
      ip_user: injiIp,
      wilayah: injiWilayah,
      user_email: document.getElementsByName('emailsurvei')[0].value.toLowerCase(),
      user_nama: document.getElementsByName('namasurvei')[0].value,
      catatan: catatan,
      jawaban: jwb
    }
    await axiosInstance.post('/api/postsurvei', postdata)
      .then(response => {
        if (response.status === 200) {
          addSurvei({ dataid: {
            idsurvei: realArray.join(),
            ip_user: injiIp,
            wilayah: injiWilayah,
            user_email: document.getElementsByName('emailsurvei')[0].value.toLowerCase(),
            user_nama: document.getElementsByName('namasurvei')[0].value,
            poin: jwb.join(),
            ket: 'Add' 
          }})
            $("#progressbar li").eq(2).addClass("active");
            setProgressBar(3)
            $("fieldset").eq(0).css("display", "none");
            $("fieldset").eq(1).css("display", "none");
            $("fieldset").eq(2).css("display", "block");
            $('#modalSurvei .btnNext').css('display', 'none')
            $('#modalSurvei .btnPrev').css('display', 'none')
            $('#modalSurvei .btnSubmit').css('display', 'none')
        }
      })
    }
  }

  function changeRadioclick(s) {
    let nm = s.target.getAttribute("name")
    $('#salah'+nm).css('display', 'none')
  }

  function setProgressBar(curStep) {
    let percent = parseFloat(100 / 3) * curStep;
    percent = percent.toFixed();
    $(".progress-bar")
    .css("width",percent+"%")
  }

  const handleClickQuesi = e => {
    $('#modalGrafikKuesi').modal('show')
    $("#isiKuesi").detach().appendTo(".injiGrafikKuesi");
  };

  function handleClickCounter() {
    $('#modalHitCounter').modal('show')
    $("#isiCounterHit").detach().appendTo(".injiHitCounter");
  }
  
  return (
    <div>
      <Header />
      <PageContainer title={title} id="topSection">
      <div className="content">{children}</div>
      </PageContainer>
      <Footer />
    </div>
  );
}

export default Page