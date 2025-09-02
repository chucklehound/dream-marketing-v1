<script is:inline>
(function () {
  function qp(n) { return new URLSearchParams(location.search).get(n); }
  function getCookie(name) {
    var parts = document.cookie.split('; ');
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].indexOf(name + '=') === 0) return parts[i].slice(name.length + 1);
    }
    return null;
  }
  function setCookie(name, value, maxAge) {
    var v = encodeURIComponent(value);
    var age = (typeof maxAge === 'number' ? maxAge : 60 * 60 * 24 * 365 * 5);
    var extra = (location.protocol === 'https:') ? ';Secure' : '';
    document.cookie = name + '=' + v + ';path=/;max-age=' + age + ';SameSite=Lax' + extra;
  }

  var scriptTag = document.currentScript;
  var accountId = null;
  try {
    var u = new URL(scriptTag.src, location.href);
    accountId = u.searchParams.get('id');
  } catch (e) {}

  // Verify tag (best-effort)
  try {
    fetch('https://apiv2.usedream.ai/site-visit/verify-tag/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId: accountId,
        domain: window.location.hostname,
        url: window.location.href
      })
    });
  } catch (e) {}

  // Capture utm if present
  if (qp('utm_source') === 'dream') {
    var d = { pid: qp('dream_pid'), oid: qp('dream_oid') };
    if (d.pid && d.oid) setCookie('dream_tracking', JSON.stringify(d));
  }

  // Build payload safely
  var payload = { accountId: accountId, url: window.location.href };
  var t = getCookie('dream_tracking');
  if (t) {
    try {
      var parsed = JSON.parse(decodeURIComponent(t));
      if (parsed && typeof parsed === 'object') {
        for (var k in parsed) if (Object.prototype.hasOwnProperty.call(parsed, k)) payload[k] = parsed[k];
      }
    } catch (e) {}
  }

  // Send visit event (best-effort)
  try {
    fetch('https://apiv2.usedream.ai/site-visit/', {
      method: 'POS
