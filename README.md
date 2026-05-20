<div align="center">

<h1>FairOps — Review Workflow Dashboard</h1>

<p>
A frontend-focused review workflow dashboard built with React and Material UI.
</p>

<p>
<a href="https://fairops.netlify.app">Live Demo</a> ·
<a href="https://github.com/jashcl/fairops-review-dashboard">GitHub Repository</a>
</p>

</div>

---

<h2>Project Summary</h2>

FairOps is a frontend-focused review workflow dashboard that simulates an internal operations tool for reviewing cases, tracking risk signals, managing review teams, and moving decisions through a structured workflow.

The project is intentionally focused on frontend engineering. Instead of adding a rushed backend, the goal was to build a stable, hosted, and explainable product UI with routing, protected pages, dashboard views, search/filter/sort flows, local service abstraction, local persistence, and a polished interface.

The current version uses local mock data and browser storage so the app can be reviewed and deployed without needing a live backend, database, or authentication server.

---

<h2>Live Demo</h2>

<p>
Live site: <a href="https://fairops.netlify.app">https://fairops.netlify.app</a>
</p>

Demo login:

```txt
Username: demo-reviewer
Password: demo123
```

Any non-empty username and password will also start a demo session.

---

<h2>What the App Does</h2>

FairOps allows a reviewer to:

- log in through a demo login flow
- access protected dashboard pages
- view review case metrics
- inspect high-risk cases
- search and filter review cases
- sort cases by risk score, team, or applicant name
- manage review teams
- export review case data
- use the app as a lightweight internal workflow dashboard

---

<h2>Main Features</h2>

<h3>Review Dashboard</h3>

- shows total active review cases
- shows pending and in-review case count
- highlights high-risk cases
- calculates average risk score
- shows a review pipeline breakdown
- provides quick access to the review queue

<h3>Review Case Queue</h3>

- search by case ID, applicant name, or email
- filter cases by review team
- filter cases by risk level
- sort cases by risk score, review team, or applicant name
- show workflow status using status chips
- show risk score with progress indicators
- export review cases as CSV
- archive cases from the queue

<h3>Review Teams</h3>

- manage review teams and review categories
- add and edit review teams
- search team data
- persist team data locally in the browser

<h3>Authentication Flow</h3>

- demo login
- local session token
- protected routes
- redirect handling for internal dashboard pages

<h3>User Interface</h3>

- dashboard-style dark interface
- responsive layout
- Material UI components
- gradient buttons and cards
- clean navigation
- status-based indicators
- custom FairOps branding and favicon

---

<h2>Tech Stack</h2>

- React
- React Router
- Material UI
- JavaScript
- Local Storage
- Create React App
- Netlify

---

<h2>Project Structure</h2>

The project is kept frontend-first. The deployed app lives inside the `frontend` folder.

```txt
fairops-review-dashboard/
  README.md
  netlify.toml
  frontend/
    package.json
    package-lock.json
    public/
      index.html
      manifest.json
      favicon.svg
      _redirects

    src/
      components/
        cases/
          ReviewCaseDetails.js
          ReviewCaseList.js

        dashboard/
          Dashboard.js

        layout/
          Navbar.js
          Footer.js

        ui/
          EmptyState.js
          ErrorState.js
          LoadingState.js

        Dashboard.js
        EmployeeList.js
        DepartmentList.js
        EmployeeForm.js
        DepartmentForm.js
        LandingPage.js
        Login.js
        Register.js
        Profile.js
        ProtectedRoute.js
        QuickActions.js
        NotFoundPage.js

      data/
        mockData.js

      services/
        employeeService.js
        departmentService.js
        graphql/
          reviewCaseOperations.js

      types/
        reviewCase.types.js

      utils/
        reviewCaseUtils.js

      App.js
      index.js
      theme.js
      App.css
      index.css
```

Some internal filenames still come from the original base structure, such as `EmployeeList.js` and `DepartmentList.js`. The product direction, UI, data, and workflow have been rebuilt around the FairOps review workflow concept. A future cleanup would rename the remaining legacy filenames fully to match the FairOps domain.

---

<h2>Architecture and Engineering Decisions</h2>

<h3>Frontend-first scope</h3>

FairOps is built as a frontend-focused product demo. The project focuses on frontend responsibilities that matter in a dashboard-style role: routing, protected views, local state handling, reusable UI patterns, dashboard layout, search/filter/sort behavior, and deployment.

I avoided adding a rushed backend because the goal was to keep the project stable, hosted, and easy to review.

<h3>Service layer separation</h3>

Data access is handled through service files instead of being scattered directly across UI components. This keeps the UI components focused on rendering, user interaction, and state updates.

The current implementation uses local browser storage, but the same service layer can later be replaced with REST or GraphQL calls.

<h3>Local persistence</h3>

The app stores demo cases, review teams, and login state in local storage. This makes the deployed version usable without an external server or database.

<h3>Protected routes</h3>

Internal pages are wrapped with a protected route component. If a user is not logged in, they are redirected to the login page before accessing dashboard screens.

<h3>Derived UI state</h3>

Search results, filters, risk labels, and dashboard values are calculated from the case data. This avoids manually duplicating state and makes the UI behavior easier to reason about.

<h3>Visual design</h3>

The interface uses a dark theme, spacing, cards, chips, progress bars, and risk indicators to make the workflow easier to scan. The design goal was to make the project feel closer to a modern internal SaaS tool rather than a basic CRUD interface.

<h3>GraphQL-ready direction</h3>

The project includes GraphQL operation files as a future API direction. The current deployed version uses local services, but the separated service layer makes it easier to replace mock data with real queries and mutations later.

---

<h2>How to Run Locally</h2>

Clone the repository:

```bash
git clone https://github.com/jashcl/fairops-review-dashboard.git
cd fairops-review-dashboard/frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The app will run at:

```txt
http://localhost:3000
```

---

<h2>Production Build</h2>

From the `frontend` folder:

```bash
npm run build
```

---

<h2>Deployment</h2>

The project is deployed on Netlify.

Netlify settings used:

```txt
Base directory: frontend
Build command: npm run build
Publish directory: build
```

React Router support is handled through the `_redirects` file:

```txt
/* /index.html 200
```

This makes routes like `/dashboard`, `/employees`, `/departments`, and `/profile` work correctly even after refreshing the page.

---

<h2>What I Focused On</h2>

- making the project stable and deployable
- cleaning the product direction into a review workflow dashboard
- creating a polished dashboard UI
- separating data access into service files
- adding protected route behavior
- building search, filter, and sorting flows
- using local storage for a reliable demo experience
- keeping the project easy to explain in an interview

---

<h2>Future Scope</h2>

The current version is kept intentionally stable for deployment and review. The next improvements I would make are:

- rename remaining legacy internal filenames to fully match the FairOps domain
- add TypeScript models for review cases, teams, and workflow status
- add tests for filtering, sorting, and risk calculation logic
- replace local mock services with a REST or GraphQL backend
- add case audit history for status changes and reviewer notes
- add reviewer/admin workflows after backend authorization is introduced

---

<h2>Author</h2>

Jash Shah  
Email: jashsujeshshah10@gmail.com  
Live Demo: https://fairops.netlify.app  
GitHub: https://github.com/jashcl/fairops-review-dashboard