import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intro to Cyberpunk and Post-Cyberpunk",
};

export default function Page() {
  return (
    <>
      <div className="main-wrap">
        <div className="wsite-not-footer" id={"wsite-content"}>
          <div className="wsite-section-wrap">
            <div className="wsite-section wsite-body-section tw:[height:467px] tw:[background-image:url(/images/271456960.jpg)] tw:[background-repeat:no-repeat] tw:[background-position:undefined_undefined] tw:[background-size:cover] tw:[background-color:transparent]">
              <div className="wsite-section-content">
                <div className="container">
                  <div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="wsite-section-wrap">
            <div className="wsite-section wsite-body-section tw:[height:auto]">
              <div className="wsite-section-content">
                <div className="container">
                  <div>
                    <div className="tw:[height:50px]"></div>

                    <h2 className="wsite-content-title tw:[text-align:left]">
                      <strong>
                        <font size={"6"}>
                          {"What are Cyberpunk and Post-Cyberpunk?"}
                        </font>
                      </strong>
                    </h2>

                    <div className="tw:[height:50px]"></div>

                    <h2 className="wsite-content-title">{"Cyberpunk"}</h2>

                    <div>
                      <div className="wsite-image wsite-image-border-none tw:[padding-top:10px] tw:[padding-bottom:10px] tw:[margin-left:0px] tw:[margin-right:0px] tw:[text-align:left]">
                        <img
                          alt={"Picture"}
                          src={"/images/divider-graphic_5_orig.png"}
                          className="tw:[width:auto] tw:[max-width:100%]"
                        />

                        <div className="tw:[display:block] tw:[font-size:90%]"></div>
                      </div>
                    </div>

                    <div className="paragraph tw:[text-align:left]">
                      <font size={"4"}>
                        {
                          "Cyberpunk as a term firstly appeared in Bruce Bethke’s short story “Cyberpunk” (1980). The author combined two words ‘cybernetics’ and ‘punk’, where cybernetics represents the technological and informational explosion, while the punk is used to point out that most of the citizens do not have any power and influence in this new world (Clute 2009, 64-78"
                        }
                      </font>
                      <font size={"4"}>
                        {")."}
                        <br />
                        {" "}
                        <br />
                        {
                          "The fathers of the literature Cyberpunk genre are “a quintet of authors: William Gibson, Bruce Sterling, Lewis Shiner, John Shirley, and Rudy Rucker, a cadre of like-minded writers harboring rebellious attitudes toward what they perceived as the inadequacies of science fiction” (Murphy 2020, 15-23)."
                        }
                        <br />
                        {" "}
                        <br />
                        {
                          "“High tech, Low life” is a short and accurate phrase used to characterize what Cyberpunk is about: high technological development which is under totalitarian corporations’ control and allows them to gain more money and power, while people's life is undervalued and the middle class disappeared. The main aesthetics of Cyberpunk is dark, underground space with vibrant neon lights and geometrical shapes (Murphy and Schmeink 2017, 7-16)."
                        }
                      </font>
                    </div>

                    <div className="tw:[height:50px]"></div>

                    <h2 className="wsite-content-title">{"Post-Cyberpunk"}</h2>

                    <div>
                      <div className="wsite-image wsite-image-border-none tw:[padding-top:10px] tw:[padding-bottom:10px] tw:[margin-left:0px] tw:[margin-right:0px] tw:[text-align:left]">
                        <img
                          alt={"Picture"}
                          src={"/images/divider-graphic_7_orig.png"}
                          className="tw:[width:auto] tw:[max-width:100%]"
                        />

                        <div className="tw:[display:block] tw:[font-size:90%]"></div>
                      </div>
                    </div>

                    <div className="paragraph tw:[text-align:left]">
                      <font size={"4"}>
                        {
                          "The emergence of Post-Cyberpunk connected with Neal Stephenson’s Snow Crash (1992), “an influential novel that played a pivotal role in transforming literary cyberpunk and popularizing post-cyberpunk” (Kilgore 2020, 48-55). The author used the main Cyberpunk elements and motives and add “a hefty dose of enthusiastic, playful irony” (Kilgore 2020, 48-55). Even the name of the main character – Hiro Protagonist – shows that the author rethinks the main aesthetics of Cyberpunk - the dark future without hope."
                        }
                        <br />
                        {" "}
                        <br />
                        {
                          "Post-Cyberpunk is an evolution of Cyberpunk where authors have the basement created by Cyberpunk such as a cliché protagonist hacker who fights against the system, high technological development, lack of middle class, virtual reality, cyborgs and “world cities”. And, at the same time, the authors have all instruments to constantly experiment with the aesthetics, narrative and ethics and the limit for experiments is only authors imagination (Kilgore 2020, 48-55). "
                        }
                      </font>
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
                    <div className="paragraph">
                      <strong>
                        <em>
                          <font size={"4"}>
                            {
                              "Let’s have a look at some of the characteristics of Cyberpunk, Post-Cyberpunk and how they are or aren't presented in The Matrix (1999)."
                            }
                          </font>
                        </em>
                      </strong>
                    </div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <a
                        className="wsite-button"
                        href={"/cyberpunk-the-matrix-and-post-cyberpunk"}
                      >
                        <span className="wsite-button-inner">
                          {"​Cyberpunk, The matrix and Post-Cyberpunk"}
                        </span>
                      </a>

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
