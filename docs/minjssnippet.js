(function() {
    // Configuration parameters for the script
    const CONFIG = {
        trackingID: "PLACEHOLDER_TRACKING_ID", // Google Analytics tracking ID. This should be replaced with the actual ID during deployment.
        enableScroll: false,                    // Determines if scroll events should be tracked. If set to true, scroll events will be tracked; otherwise, they won't.
        enableFileDownload: false,              // Determines if file download events should be tracked. If set to true, file downloads will be tracked; otherwise, they won't.
        extensions: ["pdf", "xls", ...],       // List of file extensions to track. Any file with these extensions will be considered for download tracking.
        analyticsURL: "https://www.google-analytics.com/g/collect", // The URL endpoint for sending data to Google Analytics.
        debug: false,                           // If set to true, the script will run in debug mode, which might provide additional logging or error messages.
        // ... other parameters ...
    };

    // Variables to determine if certain events are enabled based on the CONFIG
    let enScroll = CONFIG.enableScroll,        // Reflects the state of scroll tracking based on the CONFIG.
        enFdl = CONFIG.enableFileDownload,     // Reflects the state of file download tracking based on the CONFIG.

    // Variables to store various data related to events
        extCurrent = void 0,                   // Placeholder for the current file extension being processed.
        filename = void 0,                     // Placeholder for the name of the file being processed.
        targetText = void 0,                   // Placeholder for the text of the link being clicked.
        splitOrigin = void 0;                  // Placeholder for some processed data (its exact use isn't clear from the provided snippet).

    // Commonly used objects and properties for easier access
    const lStor = localStorage,                // Reference to the browser's local storage.
        sStor = sessionStorage,                // Reference to the browser's session storage.
        doc = document,                        // Reference to the document object.
        docEl = document.documentElement,      // Reference to the document's root element.
        docBody = document.body,               // Reference to the document's body element.
        docLoc = document.location,            // Reference to the document's location object (contains info about the current URL).
        w = window,                            // Reference to the global window object.
        s = screen,                            // Reference to the screen object (contains info about the user's screen).
        nav = navigator || {},                 // Reference to the navigator object (contains info about the user's browser).
        extensions = CONFIG.extensions;        // List of file extensions sourced from the CONFIG for easy reference.


function a(e, t, n, o) {
    const j = CONFIG.trackingID,
        r = () => Math.floor(Math.random() * 1e9) + 1,
        c = () => Math.floor(Date.now() / 1e3),
        F = () => (sStor._p || (sStor._p = r()), sStor._p),
        E = () => r() + "." + c(),
        _ = () => (lStor.cid_v4 || (lStor.cid_v4 = E()), lStor.cid_v4),
        m = lStor.getItem("cid_v4"),
        v = () => m ? void 0 : enScroll ? void 0 : "1",
        p = () => (sStor.sid || (sStor.sid = c()), sStor.sid),
        O = () => {
            if (!sStor._ss) return sStor._ss = "1", sStor._ss;
            if (sStor.getItem("_ss") == "1") return void 0;
        },
        a = "1",
        g = () => {
            if (sStor.sct) {
                if (enScroll) return sStor.sct;
                x = +sStor.getItem("sct") + +a;
                sStor.sct = x;
            } else sStor.sct = a;
            return sStor.sct;
        },
        i = docLoc.search,
        b = new URLSearchParams(i),
        h = ["q", "s", "search", "query", "keyword"],
        y = h.some(e => i.includes("&" + e + "=") || i.includes("?" + e + "=")),
        u = () => y ? "view_search_results" : enScroll ? "scroll" : enFdl ? "file_download" : "page_view",
        f = () => enScroll ? "90" : void 0,
        C = () => {
            if (u() == "view_search_results") {
                for (let e of b)
                    if (h.includes(e[0])) return e[1];
            } else return void 0;
        },
        d = encodeURIComponent,
        k = e => {
            let t = [];
            for (let n in e)
                e.hasOwnProperty(n) && e[n] !== void 0 && t.push(d(n) + "=" + d(e[n]));
            return t.join("&");
        },
        A = CONFIG.debug,
        S = CONFIG.analyticsURL,
        M = k({
            v: "2",
            tid: j,
            _p: F(),
            sr: (s.width * w.devicePixelRatio + "x" + s.height * w.devicePixelRatio).toString(),
            ul: (nav.language || void 0).toLowerCase(),
            cid: _(),
            _fv: v(),
            _s: "1",
            dl: docLoc.origin + docLoc.pathname + i,
            dt: doc.title || void 0,
            dr: doc.referrer || void 0,
            sid: p(),
            sct: g(),
            seg: "1",
            en: u(),
            "epn.percent_scrolled": f(),
            "ep.search_term": C(),
            "ep.file_extension": e || void 0,
            "ep.file_name": t || void 0,
            "ep.link_text": n || void 0,
            "ep.link_url": o || void 0,
            _ss: O(),
            _dbg: A ? 1 : void 0
        }),
        l = S + "?" + M;

    try {
        if (nav.sendBeacon) {
            nav.sendBeacon(l);
        } else {
            let e = new XMLHttpRequest;
            e.open("POST", l, !0);
        }
    } catch (error) {
        console.error("Error sending data to Google Analytics:", error);
    }
}


    function sPr() {
        return (docEl.scrollTop || docBody.scrollTop) / ((docEl.scrollHeight || docBody.scrollHeight) - docEl.clientHeight) * 100;
    }

    function sEv() {
        const e = sPr();
        if (e < 90) return;
        enScroll = true;
        a();
        doc.removeEventListener("scroll", sEv, { passive: true });
        enScroll = false;
    }

    doc.addEventListener("scroll", sEv, { passive: true });

    doc.addEventListener("DOMContentLoaded", function() {
        let e = doc.getElementsByTagName("a");
        for (let t = 0; t < e.length; t++) {
            if (e[t].getAttribute("href") !== null) {
                const n = e[t].getAttribute("href"),
                    s = n.substring(n.lastIndexOf("/") + 1),
                    o = s.split(".").pop();
                if (e[t].hasAttribute("download") || extensions.includes(o)) {
                    e[t].addEventListener("click", fDl, { passive: true });
                }
            }
        }
    });

    function fDl(e) {
    enFdl = true;
    const t = e.currentTarget.getAttribute("href"),
        n = t.substring(t.lastIndexOf("/") + 1),
        s = n.split(".").pop(),
        o = n.replace("." + s, ""),
        i = e.currentTarget.text,
        r = t.replace(docLoc.origin, "");
    a(s, o, i, r);
	// remove the following code
    logEvent(`File downloaded: ${i}`);
    enFdl = false;
}


function init() {
    // Initialize the main tracking function (if needed)
    a();

    // Add event listeners after the DOM is fully loaded
    doc.addEventListener("DOMContentLoaded", function() {
        // Add scroll event listener
        doc.addEventListener("scroll", sEv, { passive: true });

        // Add click event listeners to certain anchor tags
        let e = doc.getElementsByTagName("a");
        for (let t = 0; t < e.length; t++) {
            if (e[t].getAttribute("href") !== null) {
                const n = e[t].getAttribute("href"),
                    s = n.substring(n.lastIndexOf("/") + 1),
                    o = s.split(".").pop();
                if (e[t].hasAttribute("download") || CONFIG.extensions.includes(o)) {
                    e[t].addEventListener("click", fDl, { passive: true });
                }
            }
        }
    });
}

// Start the script
init();


})();
