document.addEventListener("DOMContentLoaded", () => {
  /* -----------------------------
     1) Active nav link on scroll
  ------------------------------*/
  const headerHeight = 60; // matches your CSS padding-top/height
  const sections = [...document.querySelectorAll("section[id]")];
  const navLinks = [...document.querySelectorAll(".mainInfo a")];

  // Small style so you can see the active state (optional)
  const style = document.createElement("style");
  style.textContent = `
    .mainInfo a.active { 
      border-bottom: 2px solid #49e673;
    }
  `;
  document.head.appendChild(style);

  const setActiveLink = () => {
    const scrollPos = window.scrollY + headerHeight + 1;
    let currentId = sections[0]?.id;

    for (const sec of sections) {
      if (sec.offsetTop <= scrollPos && (sec.offsetTop + sec.offsetHeight) > scrollPos) {
        currentId = sec.id;
        break;
      }
    }

    navLinks.forEach((a) => {
      const targetId = a.getAttribute("href")?.replace("#", "");
      a.classList.toggle("active", targetId === currentId);
    });
  };

  setActiveLink();
  window.addEventListener("scroll", setActiveLink);
  window.addEventListener("resize", setActiveLink);

  // Ensure header links use smooth internal scroll (backup to your CSS)
  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const hash = a.getAttribute("href");
      if (hash?.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(hash);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - headerHeight,
            behavior: "smooth",
          });
        }
      }
    });
  });

  /* -----------------------------
     2) Click-to-zoom project images
  ------------------------------*/
  const projectImages = document.querySelectorAll(".projects .projImge img");

  // Create a reusable modal
  const modal = document.createElement("div");
  modal.setAttribute(
    "style",
    `
    display:none; position:fixed; inset:0; background:rgba(0,0,0,.8);
    z-index:2000; align-items:center; justify-content:center; padding:20px;
  `
  );
  const modalImg = document.createElement("img");
  modalImg.setAttribute(
    "style",
    "max-width:95%; max-height:90%; border-radius:12px; box-shadow:0 10px 40px rgba(0,0,0,.6);"
  );
  modal.appendChild(modalImg);
  document.body.appendChild(modal);

  const closeModal = () => (modal.style.display = "none");
  modal.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  projectImages.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      modalImg.src = img.src;
      modal.style.display = "flex";
    });
  });

  /* -----------------------------
     3) Contact form "sent" toast
  ------------------------------*/
  const form = document.querySelector("#contactSection form");
  if (form) {
    // Simple toast element
    const toast = document.createElement("div");
    toast.textContent = "✅ Message sent! I’ll get back to you soon.";
    toast.setAttribute(
      "style",
      `
      position: fixed; left: 50%; transform: translateX(-50%);
      bottom: 24px; padding: 12px 16px; border-radius: 10px;
      background: linear-gradient(270deg, rgb(73,230,115) 50%, rgb(93,154,169) 60%);
      color: #082a2d; font-weight: 600; display:none; z-index:3000;
    `
    );
    document.body.appendChild(toast);

    const showToast = (ms = 2200) => {
      toast.style.display = "block";
      setTimeout(() => (toast.style.display = "none"), ms);
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic check (inputs already have "required" in HTML)
      const inputs = form.querySelectorAll("input[required], textarea[required]");
      for (const el of inputs) {
        if (!el.value.trim()) {
          el.focus();
          return;
        }
      }

      // Simulate success
      form.reset();
      showToast();
    });
  }
});
