# Skill: Product spec (stage: product_spec)

**When:** Current stage is `product_spec`. Apply when writing or updating `spec/product/spec.md`.

---

## Required sections

Every product spec must have all five:

### 1. Problem

Who has this problem and what exactly is it? Be specific — a vague problem produces a vague product.

```markdown
## Problem

Small software teams (2–15 people) lose track of tasks across Slack threads
and spreadsheets. There is no single place to see what is in progress,
what is blocked, and what each person is responsible for this week.

The cost: missed deadlines, duplicated work, and daily standups wasted
on "what are you working on?" instead of actual problems.
```

### 2. Target users

Name the user types. Be specific about their context — not "developers" but "individual contributors on a distributed team who work across 3+ projects simultaneously".

```markdown
## Target users

**Primary: Individual contributor (IC)**
- Software developer, designer, or analyst on a team of 3–20
- Works across 2–5 active projects
- Checks tasks multiple times a day

**Secondary: Team lead**
- Wants a weekly view of what the team shipped and what is blocked
- Does not micromanage — wants signal without noise
```

### 3. Core features

High-level capability list — what the product can do. Not implementation detail. No "REST API" or "Postgres database" here.

```markdown
## Core features

- Create and assign tasks within a team workspace
- Set deadlines and priority levels
- Track status through custom stages (Todo → In Progress → Done)
- View all tasks assigned to me across teams
- Get notified when a task is assigned or a deadline approaches
- Invite team members and manage roles (Owner, Admin, Member)
```

### 4. Functional requirements

"The system shall…" or "Users must be able to…" — testable statements. At least one per core feature.

```markdown
## Functional requirements

- Users must be able to create a task with a title, description, assignee,
  deadline, and priority
- The system shall prevent assigning a task to a user who is not a member
  of the team
- Users must be able to filter tasks by status, priority, and assignee
- The system shall send an email notification when a task is assigned
- Team owners must be able to remove members and transfer ownership
- The system shall enforce that only team members can view that team's tasks
```

### 5. Non-functional requirements (where relevant)

```markdown
## Non-functional requirements

- Page load under 2 seconds on a standard broadband connection
- API response under 200ms for list endpoints (p95)
- Supports up to 500 concurrent users per team at launch
- GDPR compliant: user data deletable on request
- 99.5% uptime SLA
```

---

## Quality gate

Before marking `product_spec` done, verify all of:

- [ ] Problem section names a specific user and a specific pain
- [ ] Target users section has at least one named user type with context
- [ ] Core features list at least 3 distinct capabilities
- [ ] Functional requirements has at least one testable statement per core feature
- [ ] No implementation detail in the spec (no frameworks, no DB types, no API paths)

If any item is missing, ask the user to fill it before advancing.

---

## How to run this stage

1. Read the user's idea from `workflow.state.json`.
2. Use `brainstorming` (if Superpowers installed) to ask clarifying questions one at a time:
   - "Who is the main user of this?"
   - "What problem does it solve for them?"
   - "What are the 3–5 things it must do?"
   - "Are there any constraints — compliance, existing tools to integrate with, must-not-haves?"
3. Write `spec/product/spec.md` from answers.
4. Present the spec to the user: "Here's the product spec I've written. Does this capture what you have in mind?"
5. Iterate until the user approves.
6. Run the quality gate checklist.
7. Update `spec/index.md`.

---

## spec/index.md template

```markdown
# [App name] — spec index

## One-liner
[One sentence: what it does and who it's for]

## Specs
- [Product spec](product/spec.md) — problem, users, features, requirements
- [Domain](domain/) — business rules, entities, validation
- [UX flows](ux/flows.md) — user journeys and screen flows
- [UI system](ui/system.md) — component patterns, tokens
- [Architecture](architecture/) — system design, data model, decisions

## Current stage
[stage name]

## Key decisions
- [Any important choices made so far]
```

**Constraints:** Do not write implementation detail in the product spec. Spec content must come from the user — do not invent requirements.
