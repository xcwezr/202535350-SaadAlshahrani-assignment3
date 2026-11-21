// Project data. The Work section is built from this list, so adding a project
// means adding one object here instead of copying a block of HTML.
// Loaded as a plain script (not fetched JSON) so the site still works when
// index.html is opened straight from the file system.
const PROJECTS = [
  {
    title: "Campus Event Management System",
    year: 2026,
    month: 5,
    tags: ["java"],
    summary:
      "A Java application for booking campus events across four venue and event types. " +
      "It handles login, input validation, and custom exceptions so bad data fails clearly " +
      "instead of quietly.",
    stack: "Java, object oriented design, custom exceptions",
    role: "Solo project",
    image: "assets/images/project-1.svg",
    alt: "Screenshot placeholder for the Campus Event Management System"
  },
  {
    title: "Arabic Grammar Quiz App",
    year: 2026,
    month: 3,
    tags: ["web"],
    summary:
      "A quiz app built from past exam papers, covering verb conjugation and الإعراب. " +
      "Questions are stored as data rather than hard coded markup, so adding a topic means " +
      "adding a file instead of rewriting the page.",
    stack: "JavaScript, JSON, Arabic typography",
    role: "Solo project",
    image: "assets/images/project-2.svg",
    alt: "Screenshot placeholder for the Arabic grammar quiz app"
  },
  {
    title: "KFUPM AI Calendar Assistant",
    year: 2026,
    month: 5,
    tags: ["team"],
    summary:
      "A team concept for a scheduling assistant that collects deadlines from Blackboard, " +
      "Outlook, and Teams and ranks them by urgency. I worked on the system design and the pitch.",
    stack: "System design, API integration, product pitch",
    role: "Team project, system design and pitch",
    image: "assets/images/project-3.svg",
    alt: "Screenshot placeholder for the KFUPM AI Calendar Assistant"
  },
  {
    title: "Hydrogen cell",
    year: 2020,
    month: 7,
    tags: ["team"],
    summary:
      "A team concept for producing clean energy and drinkable water from humid air. " +
      "It condenses the air into clean water, which is then separated into oxygen and hydrogen. " +
      "The oxygen is released into the environment and the hydrogen is used as energy.",
    stack: "Arduino C, and requirement engineering",
    role: "Team project, system design and pitch",
    image: "assets/images/project-4.svg",
    alt: "Screenshot placeholder for the hydrogen cell"
  }
];
