# AGENTS.md

# Concise UI Design Philosophy

Concise UI is a Vue component framework designed for **enterprise and productivity software**.

The goal is **not** to imitate Material Design, Bootstrap, mobile-first design, or flashy dashboards. The goal is to maximize usability, readability, and information density for desktop business applications.

Think:

- WinForms philosophy
- Modern web technology
- Professional enterprise appearance

---

# Core Principles

## Information Density
Every pixel should have a purpose.
Avoid excessive whitespace.
Interfaces should comfortably display many controls without feeling cramped.

Target use cases:
- ERP
- WMS
- CRM
- POS
- Finance
- Inventory
- Internal company systems
- Admin panels

Not:
- Marketing landing pages
- Portfolio websites
- Mobile-first applications

---

## Modern Appearance
Do NOT copy old WinForms visually.

Instead:
- clean
- flat
- subtle
- modern

Avoid:
- glossy gradients
- skeuomorphic effects
- excessive shadows
- oversized rounded corners

---
## Conservative Color Usage
Color communicates meaning.
Do not color everything.
Use color primarily for:
- Primary actions
- Success
- Warning
- Error
- Selection
- Focus

Most controls should remain neutral.

---

## Compact Components

Components should be intentionally compact.

Preferred defaults:
- Font: 13–14px
- Control height: ~30–32px
- Small paddings
- Tight spacing
- Small border radius

Avoid large mobile-oriented controls.

---

## Clear Visual Hierarchy
Hierarchy should come from:
- spacing
- typography
- borders

Not from giant cards or colorful backgrounds.

---

## Functional Borders
Borders are encouraged.
Inputs should always be visually distinguishable.
Panels may have subtle borders.
Tables should clearly separate rows and columns.

---

## Minimal Decoration
Avoid decoration unless it improves usability.
Examples:
Good
- subtle hover
- subtle focus ring
- subtle elevation

Avoid
- animations for decoration
- glowing effects
- floating cards everywhere
- unnecessary transitions
---

## Desktop First
Primary target:
Desktop users with keyboard and mouse.
Touch support is secondary.
Keyboard accessibility is first-class.
---

## Performance
Components should remain lightweight.
Avoid unnecessary dependencies.
Prefer native browser capabilities.
Tree-shaking should be supported.
---

## API Philosophy
APIs should be:
- predictable
- explicit
- consistent

Example:

```vue
<CButton />
<CInput />
<CCheckbox />
<CDialog />
<CDataTable />
```
Naming should remain consistent across the framework.
---

# Creating a New Component

Use this checklist whenever adding a public Concise UI component.

1. Define the component contract before implementation:
   - purpose and expected behavior
   - props, events, slots, and `v-model` shape
   - disabled, loading, empty, invalid, or indeterminate states where relevant
   - mouse and keyboard behavior
2. Create the component under `src/components/<kebab-name>/C<ComponentName>.vue`.
3. Add `types.ts` beside the component when it has reusable public types. Reuse existing shared types, such as form-control sizes, instead of duplicating them.
4. Follow the established implementation style:
   - Vue 3 `<script setup lang="ts">`
   - scoped SCSS with a `.c-*` root class
   - compact dimensions and theme CSS variables
   - no new dependency when native Vue, HTML, or CSS is sufficient
5. Implement accessibility as part of the component:
   - native semantics where possible
   - appropriate roles and ARIA state otherwise
   - labels or accessible-name support
   - keyboard navigation for interactive components
   - reduced-motion handling for meaningful animations
6. Export the component from `src/index.ts`. Export its public TypeScript types there as well.
7. Create a documentation page under `src/pages/components/<ComponentName>.vue` containing:
   - a short purpose statement
   - live examples for primary behavior
   - important states, sizes, and variants
   - JavaScript and Vue usage through `CCodeBlock` where useful
   - a properties, events, and slots reference
8. Register the documentation route in `src/router/index.ts`.
9. Add the page to both component-navigation lists in `src/layouts/useLayoutNavigation.ts`, including its active state and route command.
10. Review the complete change for API consistency, accessibility, compact presentation, documentation accuracy, and accidental unrelated edits. At minimum, run `git diff --check`.

For example, creating `CProgressBar` includes the component and public types, determinate and indeterminate behavior, optional value text, semantic variants, sizes, accessibility, documentation, routing, navigation, and public exports.

---

# Themes
Themes should modify only presentation.
Themes should NOT change:
- component behavior
- spacing philosophy
- sizing philosophy

Initial themes:
- Concise Light
- Concise Dark

Future themes may include:
- Classic
- High Contrast

---

# What Concise UI Is
- Efficient
- Compact
- Professional
- Enterprise-oriented
- Keyboard-friendly
- Productivity-focused

---

# What Concise UI Is NOT
- Material Design clone
- Bootstrap clone
- Tailwind component library
- Mobile-first framework
- Marketing website toolkit
- Highly animated UI library

---
# Decision Rule
When multiple implementations are possible, prefer the one that improves:
1. Productivity
2. Readability
3. Information density
4. Consistency
5. Simplicity

Even if it is slightly less visually trendy.
