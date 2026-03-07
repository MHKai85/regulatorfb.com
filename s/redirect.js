// Short link redirector for regulatorfb.com/s/{id}
// Reads links.json, redirects to target URL
(function() {
  var path = window.location.pathname;
  var match = path.match(/^\/s\/(.+)$/);
  if (!match) return;
  var id = match[1];
  
  fetch('/s/links.json')
    .then(function(r) { return r.json(); })
    .then(function(links) {
      if (links[id]) {
        window.location.replace(links[id]);
      } else {
        document.body.innerHTML = '<h1>Link not found</h1><p><a href="https://regulatorfb.com">Back to Regulator · FB</a></p>';
      }
    })
    .catch(function() {
      document.body.innerHTML = '<h1>Error loading link</h1><p><a href="https://regulatorfb.com">Back to Regulator · FB</a></p>';
    });
})();
