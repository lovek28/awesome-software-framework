# UI States

> UI states that the application can be in. Helps design consistent behavior and error handling.

## State: [State Name]

- **Description**: When does this state occur?
- **UI indication**: How the user sees this (loading, empty, error, success).
- **User actions**: What can the user do in this state?
- **Transitions**: Which states can follow from this one?

---

## State: Loading

- **Description**: Data or action in progress.
- **UI indication**: Spinner, skeleton, or progress indicator.
- **User actions**: Optional cancel; no destructive actions.
- **Transitions**: Success, Error, or Canceled.

---

## State: Empty

- **Description**: No data to display yet.
- **UI indication**: Empty state message and optional CTA.
- **User actions**: Create or import; follow onboarding if applicable.
- **Transitions**: Has data, or stays Empty.

---

## State: Error

- **Description**: Operation failed or data unavailable.
- **UI indication**: Error message and retry or recovery action.
- **User actions**: Retry, go back, or contact support.
- **Transitions**: Retry → Loading; back → previous state.

---

<!-- Add more states specific to your product. -->
