import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="main-wrap">
        <div className="wsite-not-footer" id={"wsite-content"}>
          <div className="wsite-section-wrap">
            <div className="wsite-section wsite-body-section tw:[height:auto] tw:[background-image:url(/images/1108042832.gif)] tw:[background-repeat:no-repeat] tw:[background-position:50%_50%] tw:[background-size:cover] tw:[background-color:transparent]">
              <div className="wsite-section-content">
                <div className="container">
                  <div>
                    <div className="tw:[height:289px]"></div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <Link className="wsite-button" href={"/the-matrix-film"}>
                        <span className="wsite-button-inner">
                          {"​START (Recommended)"}
                          <br />
                          {"​"}
                        </span>
                      </Link>

                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                    </div>

                    <div>
                      <div className="wsite-multicol">
                        <div className="tw:[margin:0_-15px]">
                          <table className="wsite-multicol-table">
                            <tbody>
                              <tr>
                                <td className="wsite-multicol-col tw:[width:27.857142857143%] tw:[padding:0_15px]">
                                  <div className="tw:[height:50px]"></div>
                                </td>
                                <td className="wsite-multicol-col tw:[width:22.142857142857%] tw:[padding:0_15px]">
                                  <div className="tw:[text-align:center]">
                                    <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                                    <Link
                                      className="wsite-button"
                                      href={"/contents"}
                                    >
                                      <span className="wsite-button-inner">
                                        {"Table of Contents"}
                                      </span>
                                    </Link>

                                    <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                                  </div>
                                </td>
                                <td className="wsite-multicol-col tw:[width:21.734693877551%] tw:[padding:0_15px]">
                                  <div className="tw:[text-align:center]">
                                    <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                                    <Link
                                      className="wsite-button"
                                      href={"/references"}
                                    >
                                      <span className="wsite-button-inner">
                                        {"Bibliography"}
                                      </span>
                                    </Link>

                                    <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                                  </div>
                                </td>
                                <td className="wsite-multicol-col tw:[width:28.265306122449%] tw:[padding:0_15px]">
                                  <div className="tw:[height:50px]"></div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
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
