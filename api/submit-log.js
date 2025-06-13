// api/submit-log.js

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const content = `### ${body.date} ${body.time} — ${body.pid}

- **RA**: ${body.ra}
- **Tasks**: ${body.tasks}
- **Bonus**: ${body.bonus}
- **Notes**: ${body.notes}

---

`;

    const filename = `notebooks/${body.date}_${body.pid}.md`;

    const githubRes = await fetch(`https://api.github.com/repos/${context.env.GH_REPO}/contents/${filename}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${context.env.GH_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add log for ${body.pid} on ${body.date}`,
        content: btoa(unescape(encodeURIComponent(content))),
      }),
    });

    if (!githubRes.ok) {
      const errorText = await githubRes.text();
      return new Response(JSON.stringify({ message: `GitHub API error: ${errorText}` }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
