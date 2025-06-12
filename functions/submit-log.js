// functions/submit-log.js
export async function onRequestPost(context) {
  const data = await context.request.json();

  const date = data.date;
  const time = data.time;
  const pid = data.pid;
  const ra = data.ra;
  const tasks = data.tasks;
  const bonus = data.bonus || "";
  const notes = data.notes || "";

  const content = `# Log Entry\n\n- **Date:** ${date}\n- **Time:** ${time}\n- **Participant ID:** ${pid}\n- **RA Name:** ${ra}\n- **Task Order:** ${tasks}\n- **Bonus:** ${bonus}\n\n## Notes\n${notes}\n`;

  const filename = `notebooks/${date}_P${pid}.md`;

  const repo = context.env.GH_REPO; // e.g., "username/abc-eln-cloudflare"
  const token = context.env.GH_API_TOKEN; // Stored as GitHub Secret
  const branch = "main";

  const getSHA = async () => {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json"
      }
    });
    if (res.status === 200) {
      const json = await res.json();
      return json.sha;
    }
    return null;
  };

  const sha = await getSHA();

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json"
    },
    body: JSON.stringify({
      message: `Add/update log: ${filename}`,
      content: btoa(unescape(encodeURIComponent(content))),
      branch,
      ...(sha && { sha })
    })
  });

  if (!res.ok) {
    const error = await res.json();
    return new Response(JSON.stringify({ message: "GitHub API error", error }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Log saved to GitHub!" }), { status: 200 });
}
