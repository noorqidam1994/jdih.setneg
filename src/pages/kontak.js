import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Page from '../components/page';
import { server } from '../config';
import CustomLoadingScreen from '../components/Loading-screeen';
import axios from "axios";
import moment from 'moment';

const Kontak = () => {
    const alphabets = process.env.TOKEN_SECRET;
    const router = useRouter();
    let idLocale = require('moment/locale/id');
    moment.updateLocale('id', idLocale);
    const tgl = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const [showTgl, setShowTgl] = useState(tgl);

    const [showLoading, setShowLoading] = useState(false);
    const [validNama, setvalidNama] = useState('');
    const [validTelp, setvalidTelp] = useState('');
    const [validEmail, setvalidEmail] = useState('');
    const [validFile, setvalidFile] = useState('');
    const [validPesan, setvalidPesan] = useState('');
    const [validCaptcha, setvalidCaptcha] = useState('');

    const [valNama, setvalNama] = useState('');
    const [valTelp, setvalTelp] = useState('');
    const [valEmail, setvalEmail] = useState('');
    const [valisiEmail, setvalisiEmail] = useState('');
    const [valPesan, setvalPesan] = useState('');
    const [valCapt, setvalCapt] = useState('');
    const [valCaptcha, setvalCaptcha] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        generate();
    }, [])

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

    const changeTelp = t => {
        t.preventDefault();
        if(t.target.value === '' || t.target.value !== t.target.value.replace(/[^0-9]/g, '')) {
            setvalidTelp('Telepon Harus Angka!!');
            setvalTelp('');
        } else {
            setvalidTelp('');
            setvalTelp(t.target.value);
        }
    }

    const changeEmail = e => {
        e.preventDefault();
        let regEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
        if(e.target.value === '' || !regEmail.test(e.target.value)) {
            setvalidEmail('Format Email Salah');
            setvalEmail(e.target.value);
            setvalisiEmail('');
        } else {
            setvalidEmail('');
            setvalEmail(e.target.value);
            setvalisiEmail(e.target.value);
        }
    }

    const changePesan = x => {
        x.preventDefault();
        if(x.target.value === '') {
            setvalidPesan('Pesan Masih Kosong!!');
            setvalPesan('');
        } else {
            setvalidPesan('');
            setvalPesan(x.target.value);
        }
    }

    const changecCaptcha = c => {
        if(c.target.value === '') {
            setvalidCaptcha('Captcha Masih Kosong!!');
            setvalCapt('');
        } else {
            setvalidCaptcha('');
            setvalCapt(c.target.value);
        }
    }

    const checkLarge = e => {
        e.preventDefault();
        if(e.target.files[0] !== undefined) {
        let file = e.target.files[0];
        let jml = Math.round((file.size / 1024));
        if(file.type === 'application/pdf' && jml <= 1024) {
            setSelectedFile(e.target.files[0]);
            setvalidFile('');
        } else {
            setvalidFile('File Harus PDF dan Ukuran Maximal 1 Mb');
            setSelectedFile(null);
        }
        } else {
            setSelectedFile(null);
            setvalidFile('');
        }
    }

    const generate = () => {
        let first = alphabets[Math.floor(Math.random() * alphabets.length)];
        let second = Math.floor(Math.random() * 10);
        let third = Math.floor(Math.random() * 10);
        let fourth = alphabets[Math.floor(Math.random() * alphabets.length)];
        let fifth = alphabets[Math.floor(Math.random() * alphabets.length)];
        let sixth = Math.floor(Math.random() * 10);
        setvalCaptcha(first.toString()+second.toString()+third.toString()+fourth.toString()+fifth.toString()+sixth.toString());
        setvalCapt('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(valNama === '') {
            setvalidNama('Nama Lengkap Masih Kosong!!');
        }
        if(valTelp === '') {
            setvalidTelp('Telepon Harus Angka!!');
        }
        if(valEmail === '') {
            setvalidEmail('Format Email Salah');
        }
        if(valPesan === '') {
            setvalidPesan('Pesan Masih Kosong!!');
        }

        if(valCapt !== valCaptcha) {
            setvalidCaptcha('Captcha salah, ulangi lagi...');
            generate();
        }

        if(valNama !== '' && valTelp !== '' && valisiEmail !== '' && valPesan !== '' && validFile === '' && valCapt === valCaptcha) {
        try {
            setShowLoading(true)
            const formData = new FormData();
            const tgl_x = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            setShowTgl(tgl_x);
            formData.append("nama", document.getElementById('nama').value);
            formData.append("telp", document.getElementById('telp').value);
            formData.append("email", document.getElementById('email').value);
            formData.append("pesan", document.getElementById('pesan').value);
            formData.append("tanggal", document.getElementById('tanggal').value);
            formData.append("file", selectedFile);
            const response = await fetch(`${server}/api/kontakpost`, {
                method: 'POST',
                body: formData,
            });
            const resjson = await response.json();
            setShowLoading(false)
            if(resjson.length > 0) {
                ins_data(resjson)
            }
        } catch (error) {
            //console.log(error);
        }
        }
    }

    async function ins_data(json_data) {
        const slag = [];
        for(var i in json_data){
            var a = json_data[i]
            slag.push(a);
        }
        const resOpt = {
            url: `${server}/api/kontakpost`,
            method: 'POST',
            timeout: 3000,
            credentials: true,
            headers: { 
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8' 
            },
          data: { 
            ket: 'inpdata',
            dt:json_data
          }
          }

          const res_p = await axios(resOpt);
          if(res_p.data.stt === 'Succsess') {
            setShowLoading(false)
            $(".berhasilxcustom").hide().show("slow").delay(3e3).hide("slow");
            const interval = setInterval(() => {
                router.reload(window.location.pathname);
              }, 1000);
            return () => clearInterval(interval);
        } else {
            setShowLoading(false)
            $(".gagalxcustom").hide().show("slow").delay(3e3).hide("slow");
        }
    }

    return(
        <div>
        {showLoading && (<CustomLoadingScreen />)}
        <Page title="Kontak">
        <section className="awlAtsdibahbar">
        <div className="card card-cascade narrower">
        <div className="view view-cascade gradient-card-header light-blue lighten-1 text-white">
        <h6 className="h6-responsive mb-0 pl-2">Kontak Pesan</h6>
        </div>
        <div className="card-body pt-0 pr-0 pl-0 pb-0 mb-5 mt-3">
        <div className="row">
        <div className="col-sm">
        <form onSubmit={handleSubmit}>
        <div style={{position: 'relative'}}>
        <div className="md-form md-outline">
        <input type="hidden" id="tanggal" value={showTgl} name="tanggal" />
        <input type="text" id="nama" onChange={changeNama} name="nama" value={valNama} className="form-control" style={{textTransform: 'capitalize'}} autoComplete="off" />
        <label className="form-label" htmlFor="nama">Nama Lengkap</label>
        <span className="vldnya">{validNama}</span>
        </div>
        </div>
        <div style={{position: 'relative'}}>
        <div className="md-form md-outline">
        <input type="text" id="telp" onChange={changeTelp} value={valTelp} name="telp" className="form-control numbersxx" autoComplete="off" />
        <label className="form-label" htmlFor="telp">Telepon</label>
        <span className="vldnya">{validTelp}</span>
        </div>
        </div>
        <div style={{position: 'relative'}}>
        <div className="md-form md-outline">
        <input type="email" id="email" onChange={changeEmail} value={valEmail} name="email" className="form-control" autoComplete="off" style={{textTransform: 'lowercase'}} />
        <label className="form-label" htmlFor="email">Email</label>
        <span className="vldnya">{validEmail}</span>
        </div>
        </div>
        <div className="input_file mb-3 md-form">
        <div className="file-field">
            <a className="btn-floating peach-gradient mt-0 float-left">
            <i className="fas fa-paperclip" aria-hidden="true"></i>
            <input type="file" className="isisFile" name="file" id="filex" accept="application/pdf" onChange={ checkLarge } />
            </a>
            <div className="file-path-wrapper">
            <input className="file-path" type="text" placeholder="Upload file, maximal ukuran 1Mb" readOnly />
            </div>
        </div>
        <span className="valid" style={{color: 'red'}}>{validFile}</span>
		</div>
        <div className="input-group">
            <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon">
                <i className="fas fa-pencil-alt prefix"></i>
                </span>
            </div>
            <textarea className="form-control" id="pesan" value={valPesan} name="pesan" rows="5" onChange={changePesan} style={{zIndex: '0'}}></textarea>
        </div>
        <span className="valid" style={{color: 'red'}}>{validPesan}</span>
        <div className="col-12 mt-2 text-center">
        <div>
        <input type="text" readOnly id="generated-captcha" value={valCaptcha} />
        </div>
        <input type="text" id="entered-captcha" value={valCapt}  placeholder="Enter the captcha.." autoComplete="off" onChange={changecCaptcha}  /> <i className="fas fa-sync _jdihReloadCaptcha" onClick={generate} style={{cursor: 'pointer'}}></i>
        <br></br><span className="valid" style={{color: 'red'}}>{validCaptcha}</span>
        </div>
        <div className="col-12">
        <button className="btn-dark-green waves-effect waves-light btn btn-lg" type="submit">KIRIM PESAN</button>
        </div>
        </form>
        </div>
        <div className="col-sm mt-2 sm2-kontak">
        <p>KEMENTERIAN SEKRETARIAT NEGARA REPUBLIK INDONESIA<br/>
        Jl. Veteran No. <span className="numbersxx">17 - 18</span> Jakarta Pusat <span className="numbersxx">10110</span>,<br/> 
        Telepon <span className="numbersxx">(021) 3845627, 3442327</span></p>
        <p style={{marginBottom: '0'}}>Link Terkait :</p>
        <a href="https://www.lapor.go.id/" target="_blank" rel="noreferrer">
        <div className="icon_lapor"><span className="spanLapor">LAPOR!</span></div>
        </a>
        </div>
        </div>
        </div>
        </div>
        </section>
        <div className="alert alert-success _jdihSuccess berhasilxcustom">
        <b>Success!</b> Pesan Berhasil Dikirim...
        </div>
        <div className="alert alert-success _jdihSuccess gagalxcustom">
        <b>Gagal!</b> Pesan Gagal Dikirim...
        </div>
        </Page>
        </div>
    )
}

export default Kontak
