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

  // ---- Lead forwarding -----------------------------------------------------
  // Send the contact form straight into the A&O field app (Supabase) so a clean,
  // structured lead lands in "Estimates" the instant someone submits — instead of
  // the team scraping it out of a notification email. Netlify STILL records the
  // submission and emails it as a backup, and if the app insert fails the lead is
  // never lost. Only active on the page that has the contact form.
  const leadForm = document.querySelector('form[name="contact"]');
  if (leadForm) {
    const SB_URL = "https://jgyimvvgjjpiwzpqfteo.supabase.co";
    const SB_KEY = "sb_publishable_QyfiEfF076_dJRNn7mNXvA_tJRCzLiH";
    // Map the website's service labels onto the app's service vocabulary.
    const SERVICE_MAP = {
      "Tree Removal": "Tree removal",
      "Dead or Dangerous Tree": "Hazardous / dead tree removal",
      "Storm Cleanup": "Storm damage cleanup",
      "Emergency Tree Service": "Emergency tree service",
      "Limb Removal / Pruning": "Tree trimming / pruning",
      "Stump Grinding": "Stump grinding",
      "Land Clearing / Brush Removal": "Land clearing",
      "Cleanup & Hauling": "Debris / brush hauling",
      Other: "Other",
    };
    // Served towns → default ZIP, for filling city/zip from the location text.
    const TOWN_ZIP = {
      "Alexander City": "35010", Auburn: "36830", Beauregard: "36804", "Camp Hill": "36850",
      Dadeville: "36853", Daviston: "36256", Eclectic: "36024", Elmore: "36025",
      "Jacksons Gap": "36861", Lafayette: "36862", "Lake Martin": "36853", Loachapoka: "36865",
      Millbrook: "36054", Montgomery: "36117", "New Site": "36256", Notasulga: "36866",
      Opelika: "36801", "Phenix City": "36867", "Pike Road": "36064", Prattville: "36066",
      Roanoke: "36274", Salem: "36874", Shorter: "36075", "Smiths Station": "36877",
      Tallassee: "36078", Tuskegee: "36083", "Union Springs": "36089", Valley: "36854",
      Waverly: "36879", Wetumpka: "36092",
    };

    const titleCase = (s) =>
      s.replace(/\s+/g, " ").trim().split(" ")
        .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w)).join(" ");
    const withTimeout = (p, ms) =>
      Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
    const enc = (obj) =>
      Object.keys(obj)
        .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k] == null ? "" : obj[k]))
        .join("&");

    const toLead = (d) => {
      const svcRaw = (d["service-needed"] || "").trim();
      const svc = SERVICE_MAP[svcRaw];
      const loc = (d["service-location"] || "").trim();
      const detail = (d.details || "").trim();
      const pref = (d["preferred-contact"] || "").trim();
      const notes = [];
      if (detail) notes.push(detail);
      if (svcRaw && !svc) notes.push("Service requested: " + svcRaw);
      if (pref) notes.push("Prefers contact by " + pref.toLowerCase() + ".");
      let city = null;
      const low = loc.toLowerCase();
      for (const t in TOWN_ZIP) {
        if (low.indexOf(t.toLowerCase()) !== -1) { city = t; break; }
      }
      const urgent =
        /emergency/i.test(svcRaw) ||
        /\b(asap|emergency|urgent|leaning|fell|fallen|on (my|the) (house|home|roof))\b/i.test(detail);
      return {
        customer_name: (d.name || "").trim() ? titleCase(d.name) : null,
        phone: (d.phone || "").trim() || null,
        email: (d.email || "").trim() || null,
        address: loc || null,
        city: city,
        zip: city ? TOWN_ZIP[city] : null,
        services: svc ? [svc] : [],
        priority: urgent ? "emergency" : "normal",
        scope_notes: notes.join("  ") || null,
        status: "lead",
        lead_source: "web",
        received_at: new Date().toISOString(),
      };
    };

    const postSupabase = (d) =>
      fetch(SB_URL + "/rest/v1/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SB_KEY,
          Authorization: "Bearer " + SB_KEY,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(toLead(d)),
      });
    const postNetlify = (d) =>
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: enc(Object.assign({ "form-name": "contact" }, d)),
      });

    leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const btn = leadForm.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      const data = {};
      new FormData(leadForm).forEach((v, k) => { data[k] = v; });
      if (data["bot-field"]) { window.location.href = "/thank-you/"; return; } // honeypot
      // App first (best-effort, time-boxed), then Netlify records it either way.
      try { await withTimeout(postSupabase(data), 4000); } catch (e) { /* Netlify still captures it */ }
      try { await withTimeout(postNetlify(data), 4000); } catch (e) {}
      window.location.href = "/thank-you/";
    });
  }
})();
