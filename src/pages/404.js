import React from 'react';
import { useRouter } from 'next/router'
import { server } from '../config';

const Custom404 = () => {
	const router = useRouter();
	const handleClickMenuNav= s => {
		router.push(server, undefined, { shallow: true })
	}
	return <>
	<div id="notfound">
	<div className="notfound">
		<div className="notfound-404">
			<h1>Oops!</h1>
			<h2>404 - Halaman tidak ditemukan</h2>
		</div>
		<a data-hover="/" onClick={handleClickMenuNav}>
		Kembali ke halam depan
	  </a>
	</div>
	</div>
	</>
  }

  export default Custom404;