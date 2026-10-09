/**
 * When a service page is opened with ?town=slug (e.g. from a town page), show town-specific headings instead of Bergen County.
 * If no ?town= but referrer is a town page (e.g. /towns/ramsey.html), use that town and add ?town= to URL.
 * From root/homepage, no param → keep "Bergen County" and "Northern New Jersey".
 */
(function() {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get('town');
    if (!slug && document.referrer && document.referrer.indexOf('/towns/') !== -1) {
        var match = document.referrer.match(/\/towns\/([a-z0-9-]+)\.html/i);
        if (match) {
            slug = match[1];
            if (window.location.search.indexOf('town=') === -1)
                window.history.replaceState(null, '', window.location.pathname + '?town=' + encodeURIComponent(slug));
        }
    }
    if (!slug) return;

    var townNames = {
        'allendale': 'Allendale',
        'alpine': 'Alpine',
        'closter': 'Closter',
        'cresskill': 'Cresskill',
        'demarest': 'Demarest',
        'franklin-lakes': 'Franklin Lakes',
        'glen-rock': 'Glen Rock',
        'ho-ho-kus': 'Ho-Ho-Kus',
        'montvale': 'Montvale',
        'old-tappan': 'Old Tappan',
        'park-ridge': 'Park Ridge',
        'ramsey': 'Ramsey',
        'river-vale': 'River Vale',
        'saddle-river': 'Saddle River',
        'upper-saddle-river': 'Upper Saddle River',
        'waldwick': 'Waldwick',
        'woodcliff-lake': 'Woodcliff Lake',
        'wyckoff': 'Wyckoff'
    };
    var townName = townNames[slug.toLowerCase()];
    if (!townName) return;

    var title = document.querySelector('.section-title');
    var subtitle = document.querySelector('.section-subtitle');
    if (title) {
        title.textContent = title.textContent
            .replace(/\s*in Bergen County,?\s*NJ\s*/gi, ' in ' + townName + ', NJ ')
            .replace(/\s*in Bergen County\s*/gi, ' in ' + townName + ' ')
            .replace(/Bergen County, NJ/gi, townName + ', NJ')
            .replace(/\s*–?\s*Bergen County\s*/gi, ' in ' + townName + ' ')
            .trim();
    }
    if (subtitle) {
        subtitle.textContent = subtitle.textContent
            .replace(/Throughout Northern New Jersey/gi, 'in ' + townName + ', NJ')
            .replace(/Northern New Jersey/gi, townName + ', NJ')
            .replace(/Upper Saddle River, Franklin Lakes & Northern NJ/gi, townName + ', NJ')
            .trim();
    }

    // Keep town filter when navigating to another service from this page (nav dropdown, footer, etc.)
    var servicePages = ['lawn-maintenance.html', 'planting-design.html', 'hardscaping.html', 'land-prep.html', 'fencing-drainage.html', 'snow-removal.html'];
    var townParam = 'town=' + slug;
    document.querySelectorAll('a[href]').forEach(function(a) {
        var href = a.getAttribute('href');
        if (!href || href.indexOf(townParam) !== -1) return;
        for (var i = 0; i < servicePages.length; i++) {
            if (href.indexOf(servicePages[i]) !== -1) {
                var parts = href.split('#');
                var base = parts[0];
                var hash = parts.length > 1 ? '#' + parts.slice(1).join('#') : '';
                var newBase = base.indexOf('?') !== -1 ? base + '&' + townParam : base + '?' + townParam;
                a.setAttribute('href', newBase + hash);
                break;
            }
        }
    });
})();
