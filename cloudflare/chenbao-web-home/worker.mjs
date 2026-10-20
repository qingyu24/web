const ORIGIN = 'https://qingyu24.github.io';
const PREFIX = '/web';

export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    if (incoming.protocol !== 'https:') {
      incoming.protocol = 'https:';
      return Response.redirect(incoming.toString(), 308);
    }
    const target = new URL(ORIGIN);
    target.pathname = PREFIX + incoming.pathname;
    target.search = incoming.search;
    const headers = new Headers();
    for (const name of ['accept', 'accept-language', 'if-none-match', 'if-modified-since', 'range']) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    try {
      const upstream = await fetch(target, { method: request.method, headers, redirect: 'manual' });
      const responseHeaders = new Headers(upstream.headers);
      responseHeaders.delete('set-cookie');
      responseHeaders.set('X-Content-Type-Options', 'nosniff');
      const location = responseHeaders.get('location');
      if (location) {
        const redirect = new URL(location, target);
        if (redirect.origin === ORIGIN && (redirect.pathname === PREFIX || redirect.pathname.startsWith(PREFIX + '/'))) {
          redirect.protocol = incoming.protocol;
          redirect.host = incoming.host;
          redirect.pathname = redirect.pathname.slice(PREFIX.length) || '/';
          responseHeaders.set('location', redirect.toString());
        }
      }
      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders,
      });
    } catch {
      console.error(JSON.stringify({ event: 'github_pages_origin_failed' }));
      return new Response('The website is temporarily unavailable. Please try again shortly.', {
        status: 502,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }
  },
};
