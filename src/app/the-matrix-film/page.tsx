import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Matrix (1999)",
};

export default function Page() {
  return (
    <>
      {"\n"}
      {"\n"}
      <div className="main-wrap">
        {"\n"}
        <div className="wsite-not-footer" id={"wsite-content"}>
          {"\n"}
          <div className="wsite-section-wrap">
            {"\n"}
            <div className="wsite-section wsite-body-section tw:[height:560px] tw:[background-image:url(/images/1153739335.jpeg)] tw:[background-repeat:no-repeat] tw:[background-position:undefined_undefined] tw:[background-size:cover] tw:[background-color:transparent]">
              {"\n"}
              <div className="wsite-section-content">
                {"\n"}
                <div className="container">
                  {"\n"}
                  <div>{"\n"}</div>
                  {"\n"}
                </div>
                {"\n"}
              </div>
              {"\n"}
            </div>
            {"\n"}
          </div>
          {"\n"}
          <div className="wsite-section-wrap">
            {"\n"}
            <div className="wsite-section wsite-body-section">
              {"\n"}
              <div className="wsite-section-content">
                {"\n"}
                <div className="container">
                  {"\n"}
                  <div>
                    {"\n"}
                    <h2 className="wsite-content-title tw:[text-align:left]">
                      <font size={"6"}>{"The Matrix (1999)"}</font>
                    </h2>
                    {"\n"}
                    <blockquote>
                      <em>
                        {
                          "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth -- the life he knows is the elaborate deception of an evil cyber-intelligence. "
                        }
                      </em>
                      <span>{"(IMDb.com, n.d.)"}</span>
                    </blockquote>
                    {"\n"}
                    <div>
                      <div className="wsite-image wsite-image-border-none tw:[padding-top:10px] tw:[padding-bottom:10px] tw:[margin-left:0px] tw:[margin-right:0px] tw:[text-align:left]">
                        {"\n"}
                        <img
                          alt={"Picture"}
                          src={"/images/divider-graphic_5.png"}
                          className="tw:[width:auto] tw:[max-width:100%]"
                        />
                        {"\n"}
                        <div className="tw:[display:block] tw:[font-size:90%]"></div>
                        {"\n"}
                      </div>
                    </div>
                    {"\n"}
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
                    {"\n"}
                    <div className="tw:[text-align:center]">
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                      {"\n"}
                      <a
                        className="wsite-button"
                        href={"/intro-to-cyberpunk-and-post-cyberpunk"}
                      >
                        {"\n"}
                        <span className="wsite-button-inner">
                          {"Cyberpunk and post-cyberpunk"}
                        </span>
                        {"\n"}
                      </a>
                      {"\n"}
                      <div className="tw:[height:10px] tw:[overflow:hidden]"></div>
                    </div>
                    {"\n"}
                  </div>
                  {"\n"}
                </div>
                {"\n"}
              </div>
              {"\n"}
            </div>
            {"\n"}
          </div>
          {"\n"}
        </div>
        {"\n"}
      </div>
      {"\n"}
      {"\n"}
    </>
  );
}
