import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blue Pill",
};

export default function Page() {
  return (
    <div className="main-wrap">
      <div className="wsite-not-footer" id={"wsite-content"}>
        <div className="wsite-section-wrap">
          <div className="wsite-section wsite-body-section tw:[height:481px] tw:[background-image:url(/images/1654168348.gif)] tw:[background-repeat:no-repeat] tw:[background-position:50%_50%] tw:[background-size:cover] tw:[background-color:transparent]">
            <div className="wsite-section-content">
              <div className="container">
                <div>
                  <div className="tw:[height:194px]"></div>

                  <div className="tw:[height:24px]"></div>

                  <div className="tw:[text-align:center]">
                    <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                    <Link className="wsite-button" href={"/"}>
                      <span className="wsite-button-inner">{"Home"}</span>
                    </Link>

                    <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
