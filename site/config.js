/* where the RAPMAG API (Cloudflare Worker) lives; local preview uses wrangler dev on 8787.
   RM_PRETTY: clean links (article/<slug>/) on the live site, ?s= links on the local preview server. */
window.RM_LOCAL=/localhost|127\.0\.0\.1/.test(location.hostname);
window.RM_API=window.RM_LOCAL?'http://127.0.0.1:8787':'https://rapmag-api.cookupking18.workers.dev';
window.RM_PRETTY=!window.RM_LOCAL;
