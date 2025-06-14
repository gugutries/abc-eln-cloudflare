export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 });
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

      const res = await fetch(`https://api.github.com/repos/gugutries/abc-eln-cloudflare/contents/${filename}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${env.GH_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add log for ${body.pid} on ${body.date}`,
          content: btoa(unescape(encodeURIComponent(content))),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        return new Response(`GitHub error: ${err}`, { status: 500 });
      }

      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (err) {
      return new Response(`Server error: ${err.message}`, { status: 500 });
    }
  }
};
