export default function handler(req, res) {
    const { id = '' } = req.query;
    const ua = req.headers['user-agent'] || '';
    const isAndroid = /android/i.test(ua);

    const appStoreUrl = 'https://apps.apple.com/us/app/roamy-save-spot-plan-trips/id6748781672';
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=ai.trymiles.app&hl=en_IN';
    const storeUrl = isAndroid ? playStoreUrl : appStoreUrl;

    // Android intent URL includes a native fallback to Play Store for Chrome
    const appUrl = isAndroid
        ? `intent://itinerary/${id}#Intent;scheme=wandr;package=com.remoteboys.wandr.wandr;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`
        : `wandr://itinerary/${id}`;

    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Wandr</title>
  <style>
    body{margin:0;font-family:-apple-system,sans-serif;background:#0D1513;
    min-height:100dvh;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:16px;color:#fff;text-align:center;padding:24px}
    .logo{font-size:48px;font-weight:800;letter-spacing:-2px}
    .sub{font-size:16px;color:rgba(255,255,255,0.55)}
    .btn{padding:14px 32px;background:#4A7EC8;color:#fff;border-radius:100px;
    font-size:16px;font-weight:600;text-decoration:none;display:inline-block}
  </style>
</head>
<body>
  <div class="logo">wandr</div>
  <p class="sub">Opening your itinerary...</p>
  <a class="btn" href="${appUrl}">Open in Wandr</a>
  <script>
    (function () {
      var storeUrl = '${storeUrl}';
      var appUrl = '${appUrl}';
      var redirected = false;

      function goToStore() {
        if (!redirected) {
          redirected = true;
          window.location.href = storeUrl;
        }
      }

      // Cancel store redirect if the app opened (page goes hidden / window loses focus)
      function cancelRedirect() {
        redirected = true;
      }

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) cancelRedirect();
      });
      window.addEventListener('blur', cancelRedirect);
      window.addEventListener('pagehide', cancelRedirect);

      // Attempt to open the app
      window.location.href = appUrl;

      // Redirect to store after 1.5 s if the app did not open
      setTimeout(goToStore, 1500);
    })();
  </script>
</body>
</html>`);
}