/* where the RAPMAG API (Cloudflare Worker) lives; local preview uses wrangler dev on 8787 */
window.RM_API=/localhost|127\.0\.0\.1/.test(location.hostname)?'http://127.0.0.1:8787':'https://rapmag-api.cookupking18.workers.dev';
