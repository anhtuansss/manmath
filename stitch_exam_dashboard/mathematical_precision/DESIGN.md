---
name: Mathematical Precision
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#424754'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#006947'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855b'
  on-tertiary-container: '#f5fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  max-width-exam: 800px
---

## Brand & Style

This design system is engineered for deep focus and academic rigor. It prioritizes the reduction of cognitive load to facilitate 2-3 hour intensive math examination sessions. The aesthetic is **Minimalist and Functional**, drawing inspiration from modern Swiss design and academic publishing.

The personality is calm, authoritative, and helpful. By utilizing a restrained color palette and generous whitespace, the interface recedes into the background, allowing the mathematical content—equations, graphs, and logic—to remain the primary focus. Every element exists to serve clarity and utility, avoiding any decorative flourishes that might distract a student during a high-stakes assessment.

## Colors

The color strategy is rooted in "Low-Fatigue Accessibility." The background utilizes a soft off-white to reduce the harsh glare of pure white screens, while the primary blue is chosen for its universal associations with trust and logic.

- **Primary & Secondary**: Used sparingly for calls to action, active navigation states, and highlighting selected answers.
- **Functional Colors**: Success, Warning, and Danger colors are reserved strictly for feedback loops (e.g., correct/incorrect marks or time-remaining alerts).
- **Neutral Palette**: A sophisticated range of cool grays provides structural definition through borders and text hierarchy without introducing visual noise.

## Typography

**Inter** is the sole typeface for this design system, chosen for its exceptional legibility in digital interfaces and its neutral, contemporary character.

- **Scale**: The hierarchy is optimized for readability. Body text for math problems defaults to `body-lg` (18px) to ensure that complex notations and subscripts remain clear.
- **Rhythm**: Tight letter-spacing is applied to larger headlines for a professional, "locked-in" feel, while labels use slightly increased tracking to improve scanning speed.
- **Math Rendering**: While Inter handles the UI, all LaTeX or mathematical expressions should be rendered in a compatible serif (like Latin Modern Math) to maintain standard academic conventions.

## Layout & Spacing

This design system employs a **Fixed-Width Content Container** for the exam mode to prevent line lengths from becoming too long, which is critical for reading comprehension.

- **Grid**: A 12-column grid is used for dashboard views, while a single-column centered layout (max-width 800px) is mandated for the actual "Exam Mode."
- **Spacing System**: A strict 4px base unit ensures consistent alignment. 
- **Vertical Rhythm**: Large gaps (32px+) are used between distinct math problems to prevent visual spillover.
- **Breakpoints**: 
  - Mobile (<640px): Full-width cards, reduced margins (16px).
  - Tablet (640px - 1024px): 24px margins, fluid containers.
  - Desktop (>1024px): Fixed-width central column for exams; 12-column dashboard.

## Elevation & Depth

To maintain a "Clean Exam" aesthetic, this design system avoids traditional drop shadows. Depth is communicated through **Tonal Layering** and **Structural Outlines**.

- **Level 0 (Background)**: `#F8FAFC` — The canvas for all content.
- **Level 1 (Cards/Containers)**: `#FFFFFF` — Used for the main question area. Defined by a 1px solid border (`#E2E8F0`).
- **Interaction Depth**: On hover, interactive elements (like answer choices) do not rise; instead, their border-color shifts to Primary (`#3B82F6`) or their background subtly shifts to a very light blue tint.
- **Focus States**: High-contrast, 2px solid primary-colored rings are used for keyboard navigation to meet accessibility standards.

## Shapes

The shape language is **Soft and Precise**. 

- **Containers**: Cards and input fields use a `rounded-sm` (4px) or `rounded-lg` (8px) corner radius. This provides a modern feel without the playfulness of highly rounded "bubble" designs.
- **Buttons**: Use `rounded-lg` (8px) to create a distinct interactive target.
- **Status Badges**: Use a slightly more rounded profile (12px or pill-shaped) to differentiate them from functional inputs.

## Components

### Cards & Question Containers
Standard cards use a white background with a 1px `#E2E8F0` border. No shadow. Padding is generous (24px to 32px) to allow math formulas "room to breathe."

### Answer Choices (Selected States)
- **Default**: White background, gray border.
- **Hover**: Light blue background tint, blue border.
- **Selected**: Blue border (2px), light blue background (`#EFF6FF`), and a "Checked" icon in the primary color. This ensures the student has zero doubt about their selection.

### Status Badges
Badges use a "Tinted" style: a high-transparency version of the status color for the background with high-contrast text.
- **Not Started**: Gray background / Dark gray text.
- **In Progress**: Blue background / Dark blue text.
- **Completed**: Green background / Dark green text.

### Progress Indicators
Thin, 4px linear bars at the top of the viewport. The background is a light gray track, and the progress is filled with a solid Primary blue. This provides a persistent but non-distracting sense of completion.

### Input Fields
Math input fields must use a monospaced font or a clear serif for variables. They feature a 1px border that thickens to 2px Primary Blue on focus.