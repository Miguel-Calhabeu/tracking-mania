# Tracking Mania - System Architecture

## Overview
Tracking Mania is a modular platform for practicing web analytics tagging. It allows users to interact with simulated web environments ("Challenges") and validates their tracking implementation in real-time.

## 1. Core Concepts
- **Challenge**: A specific scenario (e.g., "Cyberpunk Gadget Store") with defined tracking objectives.
- **Template**: A reusable "engine" (React Component) that powers multiple challenges (e.g., `EcommerceTemplate`).
- **Custom Challenge**: A user-generated challenge defined by raw HTML/JS/CSS, rendered in a secure sandbox.
- **Spy Console**: The debugging tool that intercepts network requests and validates them against objectives.

## 2. Data Schema (Supabase)

We use a **Single Table** approach with polymorphic content to store both Template-based and Custom challenges.

### Table: `challenges`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `title` | Text | Display title |
| `description` | Text | Markdown supported |
| `difficulty` | Enum | `Easy`, `Medium`, `Hard` |
| `type` | Enum | `template` OR `custom` |
| `content` | JSONB | Polymorphic payload (see below) |
| `objectives` | JSONB | Array of validation rules |
| `author_id` | UUID | Reference to `auth.users` |
| `is_published` | Boolean | Visibility toggle |
| `created_at` | Timestamp | Creation date |

### Polymorphic `content` JSONB

#### Type: `template`
Configuration for a built-in React component.
```json
{
  "templateId": "ecommerce-v1",
  "theme": "cyberpunk",
  "config": {
    "products": [...],
    "features": { "spa_navigation": true }
  }
}
```

#### Type: `custom`
Raw code for a sandboxed environment.
```json
{
  "html": "<!-- User Code -->\n<button id='buy'>Buy</button>",
  "css": ".btn { color: red; }",
  "js": "document.getElementById('buy').onclick = ..."
}
```

## 3. Component Architecture

### `ChallengeRenderer`
The main component responsible for rendering a challenge based on its `type`.
- **Input**: `challenge` object (from DB).
- **Logic**:
    - If `type === 'template'`: Renders the specific React component (e.g., `<EcommerceTemplate />`) passing `content.config`.
    - If `type === 'custom'`: Renders `<SandboxedFrame />` passing `content.html/css/js`.

### `SandboxedFrame`
A security wrapper for custom challenges.
- **Implementation**: `<iframe>` with `sandbox="allow-scripts allow-same-origin"`.
- **Communication**: Uses `window.postMessage` to bridge events from the iframe to the main app (Spy Console).

### `DebugConsole` (Spy Console)
- **Role**: Intercepts network requests (XHR/Fetch) and `postMessage` events.
- **Validation**: Compares captured events against `challenge.objectives`.

## 4. Data Flow

1.  **User** selects a challenge from the **Dashboard**.
2.  **Dashboard** loads challenge data from Supabase.
3.  **ChallengeWrapper** initializes the **Spy Console** and passes `objectives`.
4.  **ChallengeRenderer** mounts the challenge UI.
5.  **User** interacts with the challenge (clicks, navigation).
6.  **Challenge** fires network requests (GA4/GTM) or `postMessage` events.
7.  **Spy Console** captures these signals.
8.  **Spy Console** evaluates `objectives` rules against captured signals.
9.  **UI** updates to show "Signal Verified" ✅.

## 5. Design System & Localization
- **Design Source**: `docs/challenges_page.html` is the source of truth for UI tokens (colors, fonts, radius).
- **Localization**: All user-facing text is in **Portuguese (pt-BR)**.
