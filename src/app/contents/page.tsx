import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contents",
};

export default function Page() {
  return (
    <>
      <div className="banner-wrap">
        <div className="wsite-not-footer">
          <div className="wsite-section-wrap">
            <div className="wsite-section wsite-header-section tw:[background-image:url(/images/1033843029.jpg)] tw:[background-repeat:no-repeat] tw:[background-position:50%_50%] tw:[background-size:cover] tw:[background-color:transparent]">
              <div className="wsite-section-content">
                <div className="container">
                  <div className="banner">
                    <div>
                      <div className="tw:[height:249px]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-wrap">
        <div className="wsite-not-footer" id={"wsite-content"}>
          <div className="wsite-section-wrap">
            <div className="wsite-section wsite-body-section tw:[height:366px]">
              <div className="wsite-section-content">
                <div className="container">
                  <div>
                    <h2 className="wsite-content-title tw:[text-align:center]">
                      <font size={"6"}>{"Table of Contents"}</font>
                      <br />
                    </h2>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <Link className="wsite-button" href={"/"}>
                        <span className="wsite-button-inner">{"Home"}</span>
                      </Link>

                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                    </div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <Link className="wsite-button" href={"/the-matrix-film"}>
                        <span className="wsite-button-inner">
                          {"The Matrix (1999)"}
                        </span>
                      </Link>

                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                    </div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <Link
                        className="wsite-button"
                        href={"/intro-to-cyberpunk-and-post-cyberpunk"}
                      >
                        <span className="wsite-button-inner">
                          {"What are Cyberpunk and post-cyberpunk?"}
                        </span>
                      </Link>

                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                    </div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <Link
                        className="wsite-button"
                        href={"/cyberpunk-the-matrix-and-post-cyberpunk"}
                      >
                        <span className="wsite-button-inner">
                          {"Cyberpunk,​ The matrix and Post-Cyberpunk"}
                        </span>
                      </Link>

                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                    </div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <Link className="wsite-button" href={"/the-choice"}>
                        <span className="wsite-button-inner">
                          {"Blue Pill or Red Pill?"}
                        </span>
                      </Link>

                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                    </div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <Link className="wsite-button" href={"/mise-en-scene"}>
                        <span className="wsite-button-inner">
                          {"Mise en scène"}
                        </span>
                      </Link>

                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                    </div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <Link className="wsite-button" href={"/tech"}>
                        <span className="wsite-button-inner">
                          {"Technical perspective"}
                        </span>
                      </Link>

                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                    </div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <Link className="wsite-button" href={"/jean-baudrillard"}>
                        <span className="wsite-button-inner">
                          {"Jean Baudrillard's opinion"}
                        </span>
                      </Link>

                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                    </div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <Link className="wsite-button" href={"/influence"}>
                        <span className="wsite-button-inner">
                          {"Philosophical and Society Issues"}
                        </span>
                      </Link>

                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                    </div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <Link className="wsite-button" href={"/references"}>
                        <span className="wsite-button-inner">
                          {"Bibliography"}
                        </span>
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
    </>
  );
}
