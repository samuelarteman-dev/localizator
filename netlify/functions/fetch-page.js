const node_fetch = typeof fetch === "undefined" ? require("node-fetch") : fetch;

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  const targetUrl = event.queryStringParameters && event.queryStringParameters.url;

  if (!targetUrl) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Paramètre 'url' manquant." }),
    };
  }

  try {
    new URL(targetUrl);
  } catch (_) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: "URL invalide. Vérifiez le format (ex: https://example.com).",
      }),
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(function () {
    controller.abort();
  }, 10000);

  try {
    var response;
    var finalUrl = targetUrl;
    var redirectCount = 0;
    var maxRedirects = 3;
    var currentUrl = targetUrl;

    while (redirectCount <= maxRedirects) {
      response = await node_fetch(currentUrl, {
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
        var location = response.headers.get("location");
        if (!location) break;
        currentUrl = new URL(location, currentUrl).toString();
        finalUrl = currentUrl;
        redirectCount++;
      } else {
        break;
      }
    }

    if (!response.ok) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error:
            "La page a retourné une erreur HTTP " +
            response.status +
            ". Vérifiez que l'URL est accessible.",
        }),
      };
    }

    var html = await response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ html: html, finalUrl: finalUrl, status: response.status }),
    };
  } catch (err) {
    if (err.name === "AbortError") {
      return {
        statusCode: 504,
        headers,
        body: JSON.stringify({
          error: "Timeout : la page n'a pas répondu dans les 10 secondes.",
        }),
      };
    }
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        error: "Impossible d'accéder à la page : " + err.message,
      }),
    };
  } finally {
    clearTimeout(timeout);
  }
};
