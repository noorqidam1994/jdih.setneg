import cookiee from "js-cookie";
import Useragent from "../components/Useragent";

let newDate = new Date();
let year = newDate.getFullYear();

function Footer() {
  const getGeo = Useragent();
  if (getGeo != undefined) {
    cookiee.set("ip", getGeo.ip, { secure: true, expires: 7, path: "/" });
    cookiee.set("country", getGeo.countryName, {
      secure: true,
      expires: 7,
      path: "/",
    });
    cookiee.set("city", getGeo.cityName, {
      secure: true,
      expires: 7,
      path: "/",
    });
    cookiee.set("region", getGeo.regionName, {
      secure: true,
      expires: 7,
      path: "/",
    });
  }
  return (
    <div>
      <div id="fh5co-footer">
        <div className="row ml-0 mr-0">
          <div className="col-sm-12 pl-0 pl-0">
            <div className="container footer-top">
              <h6 style={{ fontWeight: "600" }}>
                KEMENTERIAN SEKRETARIAT NEGARA RI
              </h6>
              <div className="row gy-4">
                <div className="col-lg-4 col-md-6 footer-about">
                  <a
                    href="https://www.setneg.go.id/"
                    className="d-flex align-items-center"
                    target="blank"
                  >
                    <img
                      src="/img/lambang.png"
                      alt=""
                      style={{ paddingRight: "1rem", width: "70px" }}
                    />
                    <span className="glrKemen">
                      Deputi Bidang Perundang-undangan
                      <br />
                      Dan Administrasi Hukum
                    </span>
                  </a>
                  <div className="footer-contact pt-3">
                    <p>Gedung Utama Lantai 1</p>
                    <p>Jl. Veteran No. 17-18</p>
                    <p>Jakarta Pusat 10110</p>
                    <p>Provinsi DKI Jakarta</p>
                    <p className="mt-3">
                      <strong>Tautan:</strong>
                    </p>
                    <p>
                      <a href="https://www.setneg.go.id/" target="blank">
                        https://www.setneg.go.id/
                      </a>
                    </p>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <h4 className="text-center">Sosial Media</h4>
                  <p>
                    Silahkan pantau dan ikuti kegiatan kami melalui sosial media
                    berikut
                  </p>
                  <div className="social-links d-flex">
                    <a
                      className="btn btn-light me-2 btn-md-square rounded-circle waves-effect waves-light"
                      href=""
                    >
                      <i className="fab fa-twitter text-dark"></i>
                    </a>
                    <a
                      className="btn btn-light me-2 btn-md-square rounded-circle waves-effect waves-light"
                      href=""
                    >
                      <i className="fab fa-facebook-f text-dark"></i>
                    </a>
                    <a
                      className="btn btn-light me-2 btn-md-square rounded-circle waves-effect waves-light"
                      href=""
                    >
                      <i className="fab fa-youtube text-dark"></i>
                    </a>
                    <a
                      className="btn btn-light btn-md-square rounded-circle waves-effect waves-light"
                      href=""
                    >
                      <i className="fab fa-linkedin-in text-dark"></i>
                    </a>
                  </div>
                </div>

                <div className="col-lg-2 col-md-3 footer-links">
                  <h4 className="text-center">Visitor</h4>
                  <ul style={{ listStyleType: "none" }}>
                    <li>
                      <i className="bi bi-person-walking"></i>{" "}
                      <a>Online: 100</a>
                    </li>
                    <li>
                      <i className="bi bi-person-raised-hand"></i>{" "}
                      <a>Hari Ini:</a>
                    </li>
                    <li>
                      <i className="bi bi-person-standing"></i> <a>Kemarin:</a>
                    </li>
                    <li>
                      <i className="bi bi-person-arms-up"></i>{" "}
                      <a>Satu Minngu:</a>
                    </li>
                    <li>
                      <i className="bi bi-person-arms-up"></i>{" "}
                      <a>Satu Bulan:</a>
                    </li>
                    <li>
                      <i className="bi bi-universal-access"></i> <a>Semua:</a>
                    </li>
                  </ul>
                </div>

                <div className="col-lg-2 col-md-3 footer-links">
                  <h4 className="text-center">Survei Kepuasan</h4>
                  <ul style={{ listStyleType: "none" }}>
                    <li>
                      <i className="bi bi-patch-check"></i> <a>Bagus</a>
                    </li>
                    <li>
                      <i className="bi bi-patch-check"></i> <a>Cukup Bagus</a>
                    </li>
                    <li>
                      <i className="bi bi-patch-check"></i> <a>Kurang Bagus</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 pl-0 pl-0 copyright">
            {undefined != getGeo && (
              <span className="block f1">
                {getGeo.cityName},{" "}
                <b>
                  {getGeo.regionName} ({getGeo.countryName})
                </b>{" "}
                <i className="fas fa-map-marker-alt"></i>
              </span>
            )}
          </div>
          <div className="col-sm-6 pr-0 pl-0 copyright">
            <span className="block f2">
              &copy; 2018 - {year} JDIH Kementerian Sekretariat Negara
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
