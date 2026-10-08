import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Matrix (1999)",
};

export default function Page() {
  return (
    <>
      <div className="main-wrap">
        <div className="wsite-not-footer" id={"wsite-content"}>
          <div className="wsite-section-wrap">
            <div className="wsite-section wsite-body-section tw:[height:560px] tw:[background-image:url(/images/1153739335.jpeg)] tw:[background-repeat:no-repeat] tw:[background-position:undefined_undefined] tw:[background-size:cover] tw:[background-color:transparent]">
              <div className="wsite-section-content">
                <div className="container">
                  <div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="wsite-section-wrap">
            <div className="wsite-section wsite-body-section">
              <div className="wsite-section-content">
                <div className="container">
                  <div>
                    <h2 className="wsite-content-title tw:[text-align:left]">
                      <font size={"6"}>{"The Matrix (1999)"}</font>
                    </h2>

                    <blockquote>
                      <em>
                        {
                          "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth -- the life he knows is the elaborate deception of an evil cyber-intelligence. "
                        }
                      </em>
                      <span>{"(IMDb.com, n.d.)"}</span>
                    </blockquote>

                    <div>
                      <div className="wsite-image wsite-image-border-none tw:[padding-top:10px] tw:[padding-bottom:10px] tw:[margin-left:0px] tw:[margin-right:0px] tw:[text-align:left]">
                        <img
                          alt={"Picture"}
                          src={"/images/divider-graphic_5.png"}
                          className="tw:[width:auto] tw:[max-width:100%]"
                        />

                        <div className="tw:[display:block] tw:[font-size:90%]"></div>
                      </div>
                    </div>

                    <div className="paragraph">
                      <font size={"4"}>
                        {
                          "On the IMDb.com (n.d.) webpage mentioned that the Matrix is an action and sci-fi film that was released in 1999 and directed by the Wachowskis. The Matrix is one of the iconic films with its unique idea and style that remains actual even more than 20 years after realizing."
                        }
                        <br />
                        <br />
                        {
                          "In this interactive presentation through the movie’s scenes, we would like to prove that the Matrix is not just ordinary sci-fi film, it is an artwork that has clear representations of Cyberpunk and Post-cyberpunk motives and concepts. "
                        }
                      </font>
                    </div>

                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>

                      <a
                        className="wsite-button"
                        href={"/intro-to-cyberpunk-and-post-cyberpunk"}
                      >
                        <span className="wsite-button-inner">
                          {"Cyberpunk and post-cyberpunk"}
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
