export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://abc-eln-cloudflare.pages.dev",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      const content = `### ${body.date} ${body.time} — ${body.pid}

- **RA**: ${body.ra}
- **Tasks**: ${body.tasks}
- **Bonus**: ${body.bonus}
- **Notes**: ${body.notes}

---
`;

      const filename = `notebooks/${body.date}_${body.pid}.md`;

      const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/contents/${filename}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${env.GH_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `Add log for ${body.pid} on ${body.date}`,
          content: btoa(unescape(encodeURIComponent(content)))
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        return new Response(JSON.stringify({ message: `GitHub API error: ${errorText}` }), {
          status: 500,
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: corsHeaders
      });
    } catch (err) {
      return new Response(JSON.stringify({ message: err.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
