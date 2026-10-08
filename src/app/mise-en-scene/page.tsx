import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mise-en-Scène",
};

export default function Page() {
  return (
    <>
      <div className="main-wrap">
        <div className="wsite-not-footer" id={"wsite-content"}>
          <div className="wsite-section-wrap">
            <div className="wsite-section wsite-body-section">
              <div className="wsite-section-content">
                <div className="container">
                  <div>
                    <div className="tw:[height:50px]"></div>

                    <div>
                      <div className="wsite-image wsite-image-border-none tw:[padding-top:10px] tw:[padding-bottom:0px] tw:[margin-left:0px] tw:[margin-right:0px] tw:[text-align:center]">
                        <img
                          alt={"Picture"}
                          src={"/images/mise-en-sc-ne.jpg"}
                          className="tw:[width:auto] tw:[max-width:100%]"
                        />

                        <div className="tw:[display:block] tw:[font-size:90%]"></div>
                      </div>
                    </div>

                    <h2 className="wsite-content-title tw:[text-align:left]">
                      <font size={"6"}>{"Mise-en-scène"}</font>
                    </h2>

                    <div className="paragraph">
                      {"It refers to all film elements as arranged in a frame."}
                    </div>

                    <div>
                      <div className="wsite-image wsite-image-border-none tw:[padding-top:10px] tw:[padding-bottom:10px] tw:[margin-left:0px] tw:[margin-right:0px] tw:[text-align:left]">
                        <img
                          alt={"Picture"}
                          src={"/images/divider-graphic_4_orig.png"}
                          className="tw:[width:auto] tw:[max-width:100%]"
                        />

                        <div className="tw:[display:block] tw:[font-size:90%]"></div>
                      </div>
                    </div>

                    <div className="paragraph tw:[text-align:left]">
                      {"In the scene above we can see"}
                      <ol>
                        <li>
                          {
                            "Both of the characters are sitting differently. Neo seems anxious, he is sitting on the edge of his seat. Whereas, Morpheus sits comfortably with his "
                          }
                          <span>{"crossed "}</span>
                          {"legs, and it gives us a feeling that he knows "}
                          <span>{"exactly "}</span>
                          {
                            "what he's doing.  His posture signifies that he already knows what Neo wants to hear."
                          }
                        </li>
                        <li>
                          {
                            "The table between Morpheus and Neo, it is slightly inclined towards Morpheus symbolizing that he has more leverage in this scene."
                          }
                        </li>
                        <li>
                          {
                            "There's a door behind Morpheus. Till this point in the movie, it forces Neo and viewers to think and question about \"what's been going on?\" either consciously or subconsciously, and that door means that, this scene is a way out, a way to answer these questions."
                          }
                        </li>
                        <li>
                          {
                            "The shelf above fireplace behind both the characters, it can be split in two sides Neo's and Morpheus'. It reflects the state of their respective minds. On Morpheus' side it's clear. But on the Neo's side it has props, which are just lying around symbolizing a state of dissonance in his mind."
                          }
                        </li>
                        <li>
                          {
                            "Morpheus receives more light in this scene which means he has more knowledge, whereas Neo who receives less lighting is still in the dark about the truth of reality.   "
                          }
                        </li>
                      </ol>
                      <br />
                      {
                        "The above shot is straight on angle and it is a full shot."
                      }
                    </div>

                    <div className="tw:[height:50px]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="wsite-section-wrap">
            <div className="wsite-section wsite-body-section wsite-section-bg-color tw:[background-color:#000000] tw:[background-image:none]">
              <div className="wsite-section-content">
                <div className="container">
                  <div>
                    <div className="tw:[height:50px]"></div>

                    <div>
                      <div className="wsite-multicol">
                        <div className="tw:[margin:0_-45px]">
                          <table className="wsite-multicol-table">
                            <tbody>
                              <tr>
                                <td className="wsite-multicol-col tw:[width:60.413223140496%] tw:[padding:0_45px]">
                                  <div>
                                    <div className="wsite-image wsite-image-border-none tw:[padding-top:10px] tw:[padding-bottom:0px] tw:[margin-left:0px] tw:[margin-right:0px] tw:[text-align:center]">
                                      <img
                                        alt={"Picture"}
                                        src={"/images/collage_orig.jpg"}
                                        className="tw:[width:auto] tw:[max-width:100%]"
                                      />

                                      <div className="tw:[display:block] tw:[font-size:90%]"></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="wsite-multicol-col tw:[width:39.586776859504%] tw:[padding:0_45px]">
                                  <div className="tw:[height:24px]"></div>

                                  <h2 className="wsite-content-title tw:[text-align:left]">
                                    <font size={"6"}>{"Different tints"}</font>
                                  </h2>

                                  <div>
                                    <div className="wsite-image wsite-image-border-none tw:[padding-top:10px] tw:[padding-bottom:10px] tw:[margin-left:0px] tw:[margin-right:0px] tw:[text-align:left]">
                                      <img
                                        alt={"Picture"}
                                        src={
                                          "/images/divider-graphic_5_orig.png"
                                        }
                                        className="tw:[width:auto] tw:[max-width:100%]"
                                      />

                                      <div className="tw:[display:block] tw:[font-size:90%]"></div>
                                    </div>
                                  </div>

                                  <div className="paragraph tw:[text-align:left]">
                                    <font size={"5"}>
                                      {
                                        "Film uses three different filters to differentiate the reality is being shown:"
                                      }
                                    </font>
                                    <ul>
                                      <li>
                                        <font size={"3"}>
                                          {"Green for the Matrix (down left)"}
                                        </font>
                                      </li>
                                      <li>
                                        <font size={"3"}>
                                          {"Blue for the Real world (top)"}
                                        </font>
                                      </li>
                                      <li>
                                        <font size={"3"}>
                                          {
                                            "Yellow for simulation (bottom right)"
                                          }
                                        </font>
                                      </li>
                                    </ul>
                                  </div>
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

          <div className="wsite-section-wrap">
            <div className="wsite-section wsite-body-section">
              <div className="wsite-section-content">
                <div className="container">
                  <div>
                    <div>
                      <div className="wsite-multicol">
                        <div className="tw:[margin:0_-45px]">
                          <table className="wsite-multicol-table">
                            <tbody>
                              <tr>
                                <td className="wsite-multicol-col tw:[width:38.181818181818%] tw:[padding:0_45px]">
                                  <div className="tw:[height:24px]"></div>

                                  <h2 className="wsite-content-title tw:[text-align:left]">
                                    <font size={"6"}>
                                      {"Screen Transitioning"}
                                    </font>
                                  </h2>

                                  <div>
                                    <div className="wsite-image wsite-image-border-none tw:[padding-top:10px] tw:[padding-bottom:10px] tw:[margin-left:0px] tw:[margin-right:0px] tw:[text-align:left]">
                                      <img
                                        alt={"Picture"}
                                        src={
                                          "/images/divider-graphic_6_orig.png"
                                        }
                                        className="tw:[width:auto] tw:[max-width:100%]"
                                      />

                                      <div className="tw:[display:block] tw:[font-size:90%]"></div>
                                    </div>
                                  </div>

                                  <div className="paragraph tw:[text-align:left]">
                                    <em>
                                      <strong>
                                        <font size={"5"}>{"​"}</font>
                                      </strong>
                                    </em>
                                    {
                                      "We see Neo waking up multiple times in different scenes and he is often not sure if it was real or not, a good way to transition between scene making it look like it was a dream."
                                    }
                                    <br />
                                    {
                                      "Fact: This happens three times and doesn’t happen after he wakes up from the matrix. "
                                    }
                                  </div>
                                </td>
                                <td className="wsite-multicol-col tw:[width:61.818181818182%] tw:[padding:0_45px]">
                                  <div>
                                    <div className="wsite-image wsite-image-border-none tw:[padding-top:80px] tw:[padding-bottom:0px] tw:[margin-left:0px] tw:[margin-right:0px] tw:[text-align:center]">
                                      <img
                                        alt={"Picture"}
                                        src={"/images/neo-wakesup_orig.jpg"}
                                        className="tw:[width:auto] tw:[max-width:100%]"
                                      />

                                      <div className="tw:[display:block] tw:[font-size:90%]"></div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="tw:[height:50px]"></div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <Link className="wsite-button" href={"/tech"}>
                        <span className="wsite-button-inner">
                          {"Technical perspective"}
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
