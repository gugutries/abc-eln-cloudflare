// functions/submit-log.js
export async function onRequestPost(context) {
  return new Response("✅ Log received!", { status: 200 });
}

export async function onRequestGet() {
  return new Response("🚫 Use POST method.", { status: 405 });
}
