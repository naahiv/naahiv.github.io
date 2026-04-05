const workItems = [
  {
    title: "Extending the Dold-Kan Correspondence",
    year: 2024,
    kind: "paper",
    status: "completed",
    pages: 34,
    description: "Research paper",
    links: [
      { label: "PDF", href: "extending-dold-kan.pdf" }
    ]
  },
  {
    title: "An Infinitary Model of Diagrammatic Calculus in Unbiased Monoidal Categories",
    year: 2023,
    kind: "paper",
    status: "completed",
    pages: 25,
    description: "Research paper",
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2304.03725", external: true }
    ]
  },
  {
    title: "The Optimization of Flux Trajectories for the Adiabatic Controlled-Z Gate on Split-Tunable Transmons",
    year: 2022,
    kind: "paper",
    status: "published",
    pages: 9,
    venue: "AIP Advances 12, 095306 (2022)",
    description: "Published paper",
    links: [
      { label: "DOI", href: "https://doi.org/10.1063/5.0087364", external: true },
      { label: "arXiv", href: "https://arxiv.org/abs/2112.06067", external: true }
    ]
  },
  {
    title: "Towards Motivic Homotopy Theory",
    year: 2025,
    kind: "project",
    status: "in progress",
    pages: 23,
    description: "Project in progress",
    links: [
      { label: "PDF", href: "motivic-homotopy-theory.pdf" }
    ]
  },
  {
    title: "Obvious Facts in Algebraic Topology",
    year: 2025,
    kind: "project",
    status: "in progress",
    pages: 41,
    description: "Project in progress",
    links: [
      { label: "PDF", href: "obvious-alg-top-facts.pdf" }
    ]
  },
  {
    title: "The Gelfand-Fuchs Cohomology of Vector Fields on S1",
    year: 2025,
    kind: "note",
    status: "completed",
    pages: 16,
    description: "Expository note",
    links: [
      { label: "PDF", href: "gelfand-fuchs-cohomology.pdf" }
    ]
  },
  {
    title: "A Proof of Jennings' Theorem",
    year: 2025,
    kind: "note",
    status: "completed",
    pages: 10,
    description: "Expository note",
    links: [
      { label: "PDF", href: "jennings-theorem.pdf" }
    ]
  },
  {
    title: "Introduction to Galois Theory",
    year: 2024,
    kind: "project",
    status: "in progress",
    pages: 42,
    description: "Project in progress",
    links: [
      { label: "PDF", href: "galois-theory.pdf" }
    ]
  },
  {
    title: "Serre Schemes and the Quillen-Suslin Theorem",
    year: 2024,
    kind: "note",
    status: "completed",
    pages: 21,
    description: "Expository note",
    links: [
      { label: "PDF", href: "serre-schemes.pdf" }
    ]
  },
  {
    title: "Notes on Schemes",
    year: 2024,
    kind: "project",
    status: "in progress",
    pages: 31,
    description: "Project in progress",
    links: [
      { label: "PDF", href: "notes-on-schemes.pdf" }
    ]
  },
  {
    title: "Tannakian Reconstruction for Tensor Categories: A Survey",
    year: 2024,
    kind: "note",
    status: "completed",
    pages: 8,
    description: "Survey note",
    links: [
      { label: "PDF", href: "tensor-categories.pdf" }
    ]
  }
];

const workGrid = document.getElementById("workGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const resultsSummary = document.getElementById("resultsSummary");

let activeFilter = "all";
let activeQuery = "";

const sortedWork = [...workItems].sort((a, b) => {
  if (b.year !== a.year) return b.year - a.year;
  return a.title.localeCompare(b.title);
});

function normalize(value) {
  return value.toLowerCase().trim();
}

function itemMatchesFilter(item) {
  if (activeFilter === "all") return true;
  if (activeFilter === "in progress") return item.status === "in progress";
  return item.kind === activeFilter;
}

function itemMatchesQuery(item) {
  if (!activeQuery) return true;
  const haystack = [
    item.title,
    item.year,
    item.kind,
    item.status,
    item.description,
    item.venue || "",
    ...(item.links || []).map((link) => link.label)
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(activeQuery);
}

function createLinkChip(link) {
  const anchor = document.createElement("a");
  anchor.className = "link-chip";
  anchor.href = link.href;
  anchor.textContent = link.label;
  if (link.external) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  } else {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
  return anchor;
}

function createTag(text, extraClass = "") {
  const span = document.createElement("span");
  span.className = `tag ${extraClass}`.trim();
  span.textContent = text;
  return span;
}

function renderWork() {
  const filtered = sortedWork.filter((item) => itemMatchesFilter(item) && itemMatchesQuery(item));

  workGrid.innerHTML = "";

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No entries match the current search and filter combination.";
    workGrid.appendChild(empty);
  } else {
    for (const item of filtered) {
      const article = document.createElement("article");
      article.className = "work-card";

      const header = document.createElement("div");
      header.className = "work-card-header";

      const titleWrap = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = item.title;
      titleWrap.appendChild(title);

      if (item.venue) {
        const venue = document.createElement("p");
        venue.className = "work-venue";
        venue.textContent = item.venue;
        titleWrap.appendChild(venue);
      }

      const year = document.createElement("span");
      year.className = "year-badge";
      year.textContent = item.year;

      header.append(titleWrap, year);

      const meta = document.createElement("div");
      meta.className = "work-meta";
      meta.appendChild(createTag(item.kind === "project" ? "project" : item.kind));
      meta.appendChild(createTag(item.status, item.status === "in progress" ? "tag-status" : ""));
      if (item.pages) {
        meta.appendChild(createTag(`${item.pages} pages`));
      }

      const description = document.createElement("p");
      description.className = "work-description";
      description.textContent = item.description;

      const links = document.createElement("div");
      links.className = "work-links";
      for (const link of item.links) {
        links.appendChild(createLinkChip(link));
      }

      article.append(header, meta, description, links);
      workGrid.appendChild(article);
    }
  }

  const noun = filtered.length === 1 ? "entry" : "entries";
  resultsSummary.textContent = `Showing ${filtered.length} ${noun}.`;
}

function updatePageMeta() {
  document.getElementById("currentYear").textContent = new Date().getFullYear();
}

searchInput.addEventListener("input", (event) => {
  activeQuery = normalize(event.target.value);
  renderWork();
});

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    for (const candidate of filterButtons) {
      candidate.classList.toggle("active", candidate === button);
    }
    renderWork();
  });
}

updatePageMeta();
renderWork();
