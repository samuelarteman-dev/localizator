export default async (req) => {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get("url");

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (!targetUrl) {
    return new Response(
      JSON.stringify({ error: "Paramètre 'url' manquant." }),
      { status: 400, headers }
    );
  }

  try {
    new URL(targetUrl);
  } catch {
    return new Response(
      JSON.stringify({ error: "URL invalide. Vérifiez le format (ex: https://example.com)." }),
      { status: 400, headers }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    let response;
    let finalUrl = targetUrl;
    let redirectCount = 0;
    const maxRedirects = 3;

    let currentUrl = targetUrl;
    while (redirectCount <= maxRedirects) {
      response = await fetch(currentUrl, {
        signal: controller.signal,
        redirect: "manual",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,fr;q=0.8",
        },
      });

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) break;
        currentUrl = new URL(location, currentUrl).toString();
        finalUrl = currentUrl;
        redirectCount++;
      } else {
        break;
      }
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `La page a retourné une erreur HTTP ${response.status}. Vérifiez que l'URL est accessible.`,
        }),
        { status: 502, headers }
      );
    }

    const html = await response.text();

    return new Response(
      JSON.stringify({ html, finalUrl, status: response.status }),
      { status: 200, headers }
    );
  } catch (err) {
    if (err.name === "AbortError") {
      return new Response(
        JSON.stringify({
          error: "Timeout : la page n'a pas répondu dans les 10 secondes.",
        }),
        { status: 504, headers }
      );
    }
    return new Response(
      JSON.stringify({
        error: `Impossible d'accéder à la page : ${err.message}`,
      }),
      { status: 502, headers }
    );
  } finally {
    clearTimeout(timeout);
  }
};

export const config = {
  path: "/.netlify/functions/fetch-page",
};
