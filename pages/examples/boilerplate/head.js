window.addEventListener("DOMContentLoaded", function () {
  var sdkJs = document.createElement("script");
  // sdkJs.src = 'https://unpkg.com/tsiclient@1.3.0/tsiclient.js';
  sdkJs.src = "../../../dist/tsiclient.js"; // for local testing

  var sdkCss = document.createElement("link");
  sdkCss.rel = "stylesheet";
  sdkCss.type = "text/css";
  // sdkCss.href = 'https://unpkg.com/tsiclient@1.3.0/tsiclient.css';
  sdkCss.href = "../../../dist/tsiclient.css"; // for local testing

  var metaCharset = document.createElement("meta");
  metaCharset.charSet = "utf-8";

  var metaHttp = document.createElement("meta");
  metaHttp["http-equiv"] = "cache-control";
  metaHttp.content = "no-cache";

  document.getElementsByTagName("head")[0].appendChild(sdkJs);
  document.getElementsByTagName("head")[0].appendChild(sdkCss);
  document.getElementsByTagName("head")[0].appendChild(metaCharset);
  document.getElementsByTagName("head")[0].appendChild(metaHttp);

  // github link html
  var isDotCom = window.location.href.indexOf(".com") !== -1;
  var githubUrl =
    "https://github.com/Microsoft/tsiclient/tree/master/pages/examples/" +
    window.location.href.split(isDotCom ? ".com/" : ".net/")[1];
  var githubButton = document.createElement("button");
  githubButton.setAttribute(
    "onClick",
    'window.open("' + githubUrl + '", "_blank")'
  );
  Object.assign(githubButton.style, {
    marginBottom: "20px",
    float: "right",
    "font-size": "24px",
    background: "#1D75BB",
    color: "white",
    border: "none",
    display: "flex",
    "align-items": "center",
    padding: "0 0 0 12px",
    transform: "rotate(-90deg)",
    position: "fixed",
    "z-index": 100000,
    top: "30%",
    right: "-86px",
    "border-radius": "2px",
    cursor: "pointer",
  });
  githubButton.innerHTML =
    'View on Github <img style="transform: rotate(90deg)" width="48px" alt="GitHub Logomark" src="https://cdn3.iconfinder.com/data/icons/sociocons/256/github-sociocon.png">';
  document.getElementsByTagName("body")[0].prepend(githubButton);
});
