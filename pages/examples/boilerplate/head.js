window.addEventListener("DOMContentLoaded", function () {
  // Multi-path fallback logic so examples work regardless of nesting or how dist was copied
  var scriptPaths = [
    "../../../dist/kustotrender.js",
    "../../dist/kustotrender.js",
    "../dist/kustotrender.js",
    "/dist/kustotrender.js",
    "dist/kustotrender.js"
  ];
  var cssCandidatesLocal = [
    "../../../dist/kustotrender.css",
    "../../dist/kustotrender.css",
    "../dist/kustotrender.css",
    "/dist/kustotrender.css",
    "dist/kustotrender.css"
  ];
  var cssCandidatesProd = [
    "../../../dist/kustotrender.min.css",
    "../../dist/kustotrender.min.css",
    "../dist/kustotrender.min.css",
    "/dist/kustotrender.min.css",
    "dist/kustotrender.min.css"
  ];

  function tryLoadScript(index) {
    if (index >= scriptPaths.length) return;
    var p = scriptPaths[index];
    var s = document.createElement("script");
    s.src = p;
    s.onload = function () { };
    s.onerror = function () { tryLoadScript(index + 1); };
    document.head.appendChild(s);
  }

  function tryLoadCss(list, idx) {
    if (idx >= list.length) return;
    var href = list[idx];
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.type = "text/css";
    l.href = href;
  l.onload = function () { };
  l.onerror = function () { tryLoadCss(list, idx + 1); };
    document.head.appendChild(l);
  }

  var isLocal = window.location.host.startsWith("localhost:");
  tryLoadScript(0);
  tryLoadCss(isLocal ? cssCandidatesLocal : cssCandidatesProd, 0);

  var metaCharset = document.createElement("meta");
  metaCharset.charSet = "utf-8";

  var metaHttp = document.createElement("meta");
  metaHttp["http-equiv"] = "cache-control";
  metaHttp.content = "no-cache";

  document.getElementsByTagName("head")[0].appendChild(metaCharset);
  document.getElementsByTagName("head")[0].appendChild(metaHttp);

  // github link html
  var isDotCom = window.location.href.indexOf(".com") !== -1;
  var githubUrl =
    "https://github.com/Azure/azure-kusto-trender/tree/master/pages/examples/" +
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
