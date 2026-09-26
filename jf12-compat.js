// ZestyTheme Jellyfin 12+ compatibility shim
//
// Jellyfin 12 removed the per-type CSS hooks (.writersGroup, .studiosGroup, etc.)
// from the item details page. All metadata rows (Director, Writer, Studio, Genre,
// ...) now render through one shared React component and share a single class,
// `.detailsGroupItem` — see ItemDetailsMetadataList.tsx in jellyfin-web. The type
// is only distinguishable by the translated label text ("Writers", "Studios").
//
// This re-applies the old per-type class names so theme.css's existing
// `.detailsGroupItem.writersGroup` / `.detailsGroupItem.studiosGroup` rules keep
// working unmodified. Deploy via the JavaScript Injector plugin.
//
// Caveat: label matching is hardcoded to English ("Writer(s)"/"Studio(s)"). If the
// Jellyfin UI language is ever changed, update LABELS to match.
(function () {
    'use strict';

    var LABELS = {
        writersGroup: ['Writers', 'Writer'],
        studiosGroup: ['Studios', 'Studio']
    };

    function tagGroups(root) {
        var groups = root.querySelectorAll('.detailsGroupItem:not([data-jf12-tagged])');
        groups.forEach(function (group) {
            var label = group.querySelector('.label');
            if (!label) return;
            var text = label.textContent.trim();
            for (var cls in LABELS) {
                if (LABELS[cls].indexOf(text) !== -1) {
                    group.classList.add(cls);
                }
            }
            group.setAttribute('data-jf12-tagged', '1');
        });
    }

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
            m.addedNodes.forEach(function (node) {
                if (node.nodeType !== 1) return;
                if (node.matches && node.matches('.detailsGroupItem')) {
                    tagGroups(node.parentElement || document);
                } else if (node.querySelectorAll) {
                    tagGroups(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    tagGroups(document);
})();
