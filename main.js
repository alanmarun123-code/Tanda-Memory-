
document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });

  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll("[data-category]");
  filters.forEach(btn => btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    cards.forEach(c => c.style.display = (f === "all" || c.dataset.category === f) ? "" : "none");
  }));

  const form = document.getElementById("narrativeForm");
  if(form){
    const list = document.getElementById("submissionList");
    const stored = JSON.parse(localStorage.getItem("tandaNarratives") || "[]");
    const render = () => {
      list.innerHTML = "";
      stored.forEach((s,i) => {
        const el = document.createElement("div");
        el.className = "submission" + (s.approved ? " show" : "");
        el.innerHTML = `<button class="approve" data-i="${i}">${s.approved ? "Published" : "Approve & publish"}</button>
          <strong>${escapeHtml(s.title)}</strong><br><small>${escapeHtml(s.name || "Anonymous")} · ${escapeHtml(s.category)}</small>
          <p>${escapeHtml(s.text)}</p>`;
        list.appendChild(el);
      });
      list.querySelectorAll(".approve").forEach(b => b.addEventListener("click", () => {
        stored[Number(b.dataset.i)].approved = true;
        localStorage.setItem("tandaNarratives", JSON.stringify(stored));
        render();
      }));
    };
    form.addEventListener("submit", e => {
      e.preventDefault();
      const s = {
        name: form.name.value.trim(), title: form.title.value.trim(),
        category: form.category.value, text: form.text.value.trim(),
        approved:false
      };
      if(!s.title || !s.text) return;
      stored.push(s);
      localStorage.setItem("tandaNarratives", JSON.stringify(stored));
      form.reset();
      document.getElementById("received").textContent = "Your narrative has been received and placed in the review queue. It will not appear in the public collection until it has gone through the community approval process.";
      render();
    });
    render();
  }
});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
