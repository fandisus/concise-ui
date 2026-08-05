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