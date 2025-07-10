import "../public/css/custom.css";
import { useState } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

import LoaderComponent from "../components/Loading-screeen";

global.__basedir = __dirname;

function MyApp({ Component, pageProps }) {
  const [loaderx, setLoaderx] = useState(false);
  Router.events.on("routeChangeStart", (url) => {
    NProgress.start();
    setLoaderx(true);
  });
  Router.events.on("routeChangeComplete", (url) => {
    NProgress.done();
    setLoaderx(false);
  });
  Router.events.off("routeChangeError", (url) => {
    NProgress.done();
    setLoaderx(false);
  });

  return (
    <>
      {loaderx && <LoaderComponent />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
