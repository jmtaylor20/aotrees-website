(() => {
  const header = document.querySelector("header");
  const nav = header?.querySelector(".nav");
  const navRight = header?.querySelector(".nav-right");

  if (nav && navRight) {
    navRight.id = "primary-navigation";

    const toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open navigation");
    toggle.setAttribute("aria-controls", "primary-navigation");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<span class="nav-toggle-lines" aria-hidden="true"></span>';
    nav.insertBefore(toggle, navRight);

    const setMenu = (open) => {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    };

    toggle.addEventListener("click", () => {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    navRight.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
  }

  const currentFile = location.pathname.split("/").filter(Boolean).pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const linkFile = new URL(link.href, location.href).pathname.split("/").filter(Boolean).pop() || "index.html";
    if (currentFile === linkFile) link.setAttribute("aria-current", "page");
  });

  document.querySelectorAll("img:not([loading])").forEach((image, index) => {
    if (index > 1) image.loading = "lazy";
    image.decoding = "async";
  });

  const mobileCall = document.createElement("div");
  mobileCall.className = "mobile-call";
  mobileCall.setAttribute("aria-label", "Quick contact");
  mobileCall.innerHTML =
    '<a href="tel:3343323873">Call 334-332-3873</a><a href="/contact.html#contact-form">Free Estimate</a>';
  document.body.appendChild(mobileCall);
})();
