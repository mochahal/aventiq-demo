(function () {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.getElementById("mobile-nav");
  const contactDialog = document.getElementById("contact-dialog");
  const contactForm = document.getElementById("contact-form");
  const contactPanel = document.getElementById("contact-panel");
  const contactSuccess = document.getElementById("contact-success");
  const contactTopic = document.getElementById("contact-topic");
  const searchDialog = document.getElementById("search-dialog");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const articleDialog = document.getElementById("article-dialog");
  const noticeDialog = document.getElementById("notice-dialog");
  const noticeText = document.getElementById("notice-text");

  const searchIndex = [
    { href: "#top", label: "Home", keywords: "home hero" },
    { href: "#about", label: "About AVENTIQ", keywords: "about firm approach" },
    { href: "#services", label: "Services", keywords: "services expertise" },
    { href: "#showcase", label: "Tax Solutions", keywords: "tax compliance planning advisory" },
    { href: "#showcase", label: "Financial Advisory", keywords: "financial advisory guidance" },
    { href: "#showcase", label: "Business Support", keywords: "business support setup" },
    { href: "#showcase", label: "Reporting & Analysis", keywords: "reporting analysis insights" },
    { href: "#insights", label: "Insights", keywords: "insights sample perspectives" },
    { href: "#article-jordan", label: "Sample: Key Tax Considerations for Businesses in Jordan", keywords: "jordan tax sample article", article: "jordan" },
    { href: "#article-foundation", label: "Sample: Building a Stronger Financial Foundation", keywords: "foundation sample article", article: "foundation" },
    { href: "#article-regulatory", label: "Sample: Navigating Regulatory Changes in 2025", keywords: "regulatory sample article", article: "regulatory" },
    { href: "#contact", label: "Contact", keywords: "contact get in touch let's talk" },
    { href: "privacy.html", label: "Privacy Policy", keywords: "privacy policy" },
    { href: "terms.html", label: "Terms of Use", keywords: "terms of use" }
  ];

  function setCurrent(key) {
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === key) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function closeMobileNav() {
    if (!mobileNav || mobileNav.hidden) return;
    mobileNav.hidden = true;
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      const label = toggle.querySelector(".sr-only");
      if (label) label.textContent = "Open menu";
    }
    document.body.classList.remove("nav-open");
  }

  function openMobileNav() {
    if (!mobileNav || !toggle) return;
    mobileNav.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    const label = toggle.querySelector(".sr-only");
    if (label) label.textContent = "Close menu";
    document.body.classList.add("nav-open");
    const first = mobileNav.querySelector("a");
    if (first) first.focus();
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      if (mobileNav.hidden) openMobileNav();
      else {
        closeMobileNav();
        toggle.focus();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileNav && !mobileNav.hidden) {
      closeMobileNav();
      if (toggle) toggle.focus();
    }
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMobileNav());
  });

  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const sections = document.querySelectorAll("[data-section]");
  if (sections.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setCurrent(visible[0].target.dataset.section);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.15, 0.4, 0.7] }
    );
    sections.forEach((section) => observer.observe(section));
  }

  function openDialog(dialog) {
    if (!dialog || typeof dialog.showModal !== "function") return;
    if (!dialog.open) dialog.showModal();
  }

  function resetContact() {
    if (!contactForm || !contactPanel || !contactSuccess) return;
    contactForm.reset();
    contactPanel.hidden = false;
    contactSuccess.hidden = true;
    if (contactTopic) {
      contactTopic.hidden = true;
      contactTopic.textContent = "";
    }
  }

  document.querySelectorAll("[data-open-contact]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      if (!contactDialog) return;
      event.preventDefault();
      closeMobileNav();
      resetContact();
      const topic = trigger.getAttribute("data-topic");
      if (topic && contactTopic) {
        contactTopic.hidden = false;
        contactTopic.textContent = "Regarding: " + topic;
      }
      openDialog(contactDialog);
      const name = document.getElementById("contact-name");
      if (name) name.focus();
    });
  });

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    contactPanel.hidden = true;
    contactSuccess.hidden = false;
    contactSuccess.querySelector("button")?.focus();
  });

  function renderSearch(query) {
    if (!searchResults) return;
    const needle = query.trim().toLowerCase();
    const matches = searchIndex.filter((item) => {
      const haystack = (item.label + " " + item.keywords).toLowerCase();
      return !needle || haystack.includes(needle);
    });
    searchResults.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement("li");
      empty.className = "search-empty";
      empty.textContent = "No matching pages in this demo.";
      searchResults.append(empty);
      return;
    }
    matches.forEach((item) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.label;
      if (item.article) link.dataset.article = item.article;
      li.append(link);
      searchResults.append(li);
    });
  }

  document.querySelector("[data-open-search]")?.addEventListener("click", () => {
    if (!searchDialog) return;
    renderSearch("");
    openDialog(searchDialog);
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
  });

  searchInput?.addEventListener("input", () => renderSearch(searchInput.value));
  document.getElementById("search-form")?.addEventListener("submit", (event) => event.preventDefault());

  searchResults?.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    if (link.dataset.article) {
      event.preventDefault();
      searchDialog?.close();
      openArticle(link.dataset.article);
      return;
    }
    if (link.getAttribute("href")?.startsWith("#")) searchDialog?.close();
  });

  function openArticle(id) {
    const source = document.getElementById("article-" + id);
    if (!source || !articleDialog) return;
    const title = document.getElementById("article-title");
    const date = document.getElementById("article-date");
    const body = document.getElementById("article-body");
    if (title) title.textContent = source.dataset.title || "";
    if (date) {
      date.textContent = "";
      const flag = document.createElement("span");
      flag.className = "sample-flag";
      flag.textContent = "Sample";
      date.append(flag, " " + (source.dataset.date || ""));
    }
    if (body) body.replaceChildren(...source.cloneNode(true).childNodes);
    openDialog(articleDialog);
  }

  document.querySelectorAll("[data-article]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openArticle(trigger.dataset.article);
    });
  });

  document.querySelectorAll("[data-social]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!noticeDialog || !noticeText) return;
      noticeText.textContent = button.dataset.social + " is a placeholder in this demo. It does not open a profile.";
      openDialog(noticeDialog);
    });
  });

  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog")?.close());
  });

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      if (dialog === contactDialog) resetContact();
    });
  });

  const aboutToggle = document.querySelector("[data-about-toggle]");
  const aboutMore = document.getElementById("about-more");
  aboutToggle?.addEventListener("click", () => {
    if (!aboutMore) return;
    const open = aboutMore.hidden;
    aboutMore.hidden = !open;
    aboutToggle.setAttribute("aria-expanded", String(open));
    const label = aboutToggle.firstChild;
    if (label && label.nodeType === Node.TEXT_NODE) {
      label.textContent = open ? "Show less " : "Learn More ";
    }
  });
})();
