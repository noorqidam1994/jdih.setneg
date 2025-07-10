import Head from "next/head";
// import Script from 'next/script';

export default function PageContainer({ title, children }) {
  return (
    <>
      <Head>
        <title>
          {typeof title === 'string' 
            ? `${title} || JDIH Kementerian Sekretariat Negara`
            : Array.isArray(title) 
              ? `${title.join(' ')} || JDIH Kementerian Sekretariat Negara`
              : 'JDIH Kementerian Sekretariat Negara'
          }
        </title>
        <meta
          name="keywords"
          content="setneg,kementerian,sekretaris,negara,jdih,hukum,undang-undang,peraturan,ditetapkan"
        />
        <meta
          name="description"
          content="Jaringan Dokumentasi Informasi Hukum"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="/css/mdb.min.css"
          type="text/css"
          media="all"
        />
        <link
          rel="stylesheet"
          href="/css/bootstrap.min.css"
          type="text/css"
          media="all"
        />
        <link
          rel="stylesheet"
          href="/css/all.min.css"
          type="text/css"
          media="all"
        />
        <link href="/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
        <link href="/aos/aos.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="/css/perfect-scrollbar.css"
          type="text/css"
          media="all"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css"
          type="text/css"
        />
        <link
          rel="stylesheet"
          href="/css/swiper-bundle.min.css"
          type="text/css"
        />
        <script src="/js/jquery.min.js"></script>
      </Head>
      <script src="/js/mdb.min.js" strategy="beforeInteractive" />
      <script src="/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
      <script src="/js/swiper-bundle.min.js" strategy="beforeInteractive" />
      <script src="/js/main.js" strategy="beforeInteractive" />
      <script src="/aos/aos.js" />
      <div className="container">
        <main className="isijdih">{children}</main>
      </div>
    </>
  );
}
