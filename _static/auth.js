// _static/auth.js
(function () {
  const correctUsername = "%%USERNAME%%";
  const correctPassword = "%%PASSWORD%%";

  const user = prompt("Username:");
  const pass = prompt("Password:");

  if (user !== correctUsername || pass !== correctPassword) {
    document.body.innerHTML = "<h1 style='text-align:center;'>🔒 Access Denied. Contact Lab Admin.</h1>";
    throw new Error("Unauthorized");
  }
})();
