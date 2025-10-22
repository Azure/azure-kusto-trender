window.addEventListener('DOMContentLoaded', () => {
  // Load KustoTrender JS and CSS with a minimal, explicit 2-path fallback:
  // 1. Absolute /dist/ (webpack-dev-server or hosted root)
  // 2. Relative dist/   (static copied samples after build)
  const JS_CANDIDATES = ['/dist/kustotrender.js', 'dist/kustotrender.js'];
  const CSS_CANDIDATES = ['/dist/kustotrender.css', 'dist/kustotrender.css'];

  function loadFirst(list, tagFactory, doneLabel) {
    let index = 0;
    function next() {
      if (index >= list.length) {
        console.warn(`[head.js] Failed to load any ${doneLabel} from candidates:`, list);
        return;
      }
      const el = tagFactory(list[index], () => {/* success */}, () => {
        index++;
        next();
      });
      document.head.appendChild(el);
    }
    next();
  }

  loadFirst(JS_CANDIDATES, (src, _onOk, onErr) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => { /* loaded */ };
    s.onerror = onErr;
    return s;
  }, 'script');

  loadFirst(CSS_CANDIDATES, (href, _onOk, onErr) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.onerror = onErr;
    return l;
  }, 'stylesheet');

  // Meta tags (kept minimal)
  const metaCharset = document.createElement('meta');
  metaCharset.charSet = 'utf-8';
  const metaCache = document.createElement('meta');
  metaCache.httpEquiv = 'cache-control';
  metaCache.content = 'no-cache';
  document.head.appendChild(metaCharset);
  document.head.appendChild(metaCache);

  // GitHub ribbon/button (left as-is, minor restyle only if desired)
  const isDotCom = window.location.href.includes('.com/');
  const urlParts = window.location.href.split(isDotCom ? '.com/' : '.net/');
  const relativeExamplePath = urlParts.length > 1 ? urlParts[1] : '';
  const githubUrl = 'https://github.com/Azure/azure-kusto-trender/tree/master/pages/examples/' + relativeExamplePath;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.onclick = () => window.open(githubUrl, '_blank');
  Object.assign(btn.style, {
    marginBottom: '20px',
    float: 'right',
    fontSize: '24px',
    background: '#1D75BB',
    color: 'white',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    padding: '0 0 0 12px',
    transform: 'rotate(-90deg)',
    position: 'fixed',
    zIndex: 100000,
    top: '30%',
    right: '-86px',
    borderRadius: '2px',
    cursor: 'pointer'
  });
  btn.innerHTML = 'View on Github <img style="transform: rotate(90deg)" width="48" alt="GitHub" src="https://cdn3.iconfinder.com/data/icons/sociocons/256/github-sociocon.png">';
  document.body.prepend(btn);
});