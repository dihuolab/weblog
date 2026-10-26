/* ==========================================================================
   DIHUOLAB · English content data
   --------------------------------------------------------------------------
   Update the English log and projects here. No build step required.
   - New log entry: copy a news item; change date / type / title / summary.
   - New project: copy a project; change fields. Tags become filter chips.
   - Date format: YYYY-MM-DD
   ========================================================================== */

window.DIHUO_SITE = {
  name: "DIHUOLAB",
  repo: "https://github.com/dihuolab/weblog",
  issueNew: "https://github.com/dihuolab/weblog/issues/new",
  issueChoose: "https://github.com/dihuolab/weblog/issues/new/choose"
};

window.DIHUO_DATA = {
  /* ------------------------------- Log ------------------------------- */
  news: [
    {
      date: "2026-10-24",
      type: "Site",
      title: "DIHUOLAB is now online",
      summary:
        "We are putting a door on the internet: this is where we will log the lab's status, projects, events and ideas. It is rough for now, but it will grow alongside our workbench.",
      link: ""
    },
    {
      date: "2026-10-24",
      type: "Project",
      title: "The first open calls are live",
      summary:
        "Workbench and fixtures, radio experiments, space tools, youth courses, outdoor gear modifications—starting with small goals we can tackle together. Claim one or add your own.",
      link: "projects.html"
    },
    {
      date: "2026-10-24",
      type: "Site",
      title: "How this log will be updated",
      summary:
        "There will be two kinds of entries: what is happening at DIHUOLAB, and things worth seeing in the maker world. We will not post often, but we will keep it real, useful and traceable to the source.",
      link: ""
    }
  ],

  /* ----------------------------- Projects ----------------------------- */
  projects: [
    {
      title: "Modular workbench and aluminium fixture system",
      status: "Recruiting",
      tags: ["Aluminium", "Structure", "3D printing"],
      summary:
        "Build a workbench and fixture set from aluminium extrusion, connectors and printed parts that can change with each project: equipment has a place, work-in-progress has a home, and switching projects does not mean starting over.",
      need: [
        "Structural design / assembly",
        "3D printing and slicing",
        "People willing to iterate"
      ],
      offer: [
        "Extrusion and printing capabilities",
        "Assembly space",
        "Real testing scenarios"
      ],
      note: "Best for people with mechanical, industrial design, or hands-on skills."
    },
    {
      title: "DIY radio receiver and antenna experiments",
      status: "Recruiting",
      tags: ["Radio", "Electronics", "Embedded"],
      summary:
        "From SDR reception and antenna building to field tests, build a receiver and direction-finding kit you can take outdoors. First make it work; then make it work well.",
      need: [
        "RF / antenna fundamentals",
        "Soldering and debugging",
        "Embedded systems and data logging"
      ],
      offer: [
        "Electronics R&D and test setup",
        "Outdoor test sites",
        "People to read the manuals with"
      ],
      note: "Beginners welcome—as long as you are willing to start with one antenna."
    },
    {
      title: "Equipment and project management tools for the makerspace",
      status: "Preparing",
      tags: ["Software", "AI", "Frontend"],
      summary:
        "Build a lightweight system for equipment bookings, material logs and project boards—and see whether AI can actually help, rather than just adding another button.",
      need: [
        "Frontend / interaction",
        "Backend or local-first approach",
        "AI application experiments"
      ],
      offer: [
        "Real usage scenarios",
        "Room to iterate",
        "Equipment and space"
      ],
      note: ""
    },
    {
      title: "Co-creating youth maker courses",
      status: "Recruiting",
      tags: ["Education", "Curriculum", "Content"],
      summary:
        "Turn 3D printing, electronics and coding into a course kids can handle and take a finished object home from. Not about showing off tech—about saying, \u201cI made this myself.\u201d",
      need: [
        "Curriculum design",
        "Instructors / teaching assistants",
        "Visuals and teaching aids"
      ],
      offer: [
        "Space and equipment",
        "Chances to run trial classes",
        "Co-credit on the course"
      ],
      note: ""
    },
    {
      title: "Home energy and electricity monitoring",
      status: "Preparing",
      tags: ["Home", "Electronics", "Data"],
      summary:
        "Build an electricity monitor a household can actually understand: which devices are quietly draining power, and whether solar or storage is really paying off. The data has to be useful, not just pretty.",
      need: [
        "Electronics / sensing",
        "Data visualization",
        "Real home environments"
      ],
      offer: [
        "R&D and test setup",
        "Installation and debugging",
        "Long-running data"
      ],
      note: ""
    },
    {
      title: "Lightweight modifications for outdoor gear",
      status: "Preparing",
      tags: ["Outdoor", "3D printing", "Structure"],
      summary:
        "Start from real pain points in camping, cycling and off-roading, and make a few take-it-outdoors modifications using printed parts, extrusion and simple electronics.",
      need: [
        "Outdoor users / people with problems",
        "Structural design",
        "Field testing"
      ],
      offer: [
        "Printing and fabrication",
        "Prototype iteration",
        "People willing to test in the wild"
      ],
      note: "Start with one small thing that genuinely annoys you."
    }
  ]
};
