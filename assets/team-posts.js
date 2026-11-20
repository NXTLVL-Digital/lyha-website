// Renders coach and board posts for one team from the board-editable data file.
// The section on the page carries data-team; it stays hidden when that team has no posts.
(function () {
  var section = document.getElementById('team-posts');
  var list = document.getElementById('team-posts-list');
  if (!section || !list) return;

  var team = section.getAttribute('data-team');
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var fmtDate = function (iso) {
    var p = String(iso || '').split('-');
    var m = parseInt(p[1], 10);
    if (p.length !== 3 || !m || m < 1 || m > 12) return iso || '';
    return MONTHS[m - 1] + ' ' + parseInt(p[2], 10) + ', ' + p[0];
  };
  // Only same-origin or https paths render, so a bad data entry can't inject a URL scheme.
  var safePath = function (v) { return typeof v === 'string' && /^(\/|https:\/\/)/.test(v); };

  fetch('/data/team-posts.json')
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (data) {
      var items = (data.posts || [])
        .filter(function (p) { return p && p.title && p.team === team; })
        .sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
      if (!items.length) return;

      items.forEach(function (p) {
        var item = document.createElement('article');
        item.className = 'update-item';

        var date = document.createElement('div');
        date.className = 'update-date';
        date.textContent = fmtDate(p.date);
        item.appendChild(date);

        var title = document.createElement('h3');
        title.className = 'update-title';
        if (safePath(p.link)) {
          var a = document.createElement('a');
          a.href = p.link;
          a.textContent = p.title;
          title.appendChild(a);
        } else {
          title.textContent = p.title;
        }
        item.appendChild(title);

        if (p.body) {
          var body = document.createElement('p');
          body.className = 'update-body';
          body.textContent = p.body;
          item.appendChild(body);
        }

        if (safePath(p.image)) {
          var fig = document.createElement('figure');
          fig.className = 'post-photo';
          var img = document.createElement('img');
          img.src = p.image;
          img.alt = p.alt || p.title;
          img.loading = 'lazy';
          fig.appendChild(img);
          if (p.caption) {
            var cap = document.createElement('figcaption');
            cap.textContent = p.caption;
            fig.appendChild(cap);
          }
          item.appendChild(fig);
        }

        list.appendChild(item);
      });

      section.hidden = false;
    })
    .catch(function () {});
})();
