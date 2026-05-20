# Kings Multimedia Project Context

## Stack

- Laravel backend with Fortify authentication, Inertia, React, Vite, and Tailwind CSS.
- Frontend lives in `resources/js`.
- Main public landing page is `resources/js/pages/welcome.tsx`.
- Auth, settings, and team management come from the Laravel React starter structure.
- Custom admin/client dashboard work lives mostly in `resources/js/pages/Admin`, `resources/js/pages/User`, and `resources/js/layouts/DashboardLayout.jsx`.

## Public Landing Page

- The landing page uses a cinematic Kings Media / TheKingsVault style.
- Key components include:
  - `hero-section.tsx`
  - `feature-cards.tsx`
  - `portfolio-showcase.tsx`
  - `scroll-indicator.tsx`
  - `section-reveal.tsx`
  - `camera-model.tsx`
- It uses a 3D camera model from `public/3D/dlsr_camera_olympus_e-400.glb`.

## Authentication And Teams

- Fortify routes handle login, registration, email verification, password reset, two-factor authentication, and logout.
- Team support exists through:
  - `Team`
  - `Membership`
  - `TeamInvitation`
  - team controllers, policies, requests, and support classes.
- Team dashboard route still exists at `/{current_team}/dashboard`.

## Dashboard Layouts

- The starter app layout remains in `resources/js/layouts/app-layout.tsx`.
- A custom dashboard shell exists at `resources/js/layouts/DashboardLayout.jsx`.
- The custom dashboard layout includes:
  - Admin navigation
  - Client navigation
  - User dropdown
  - Theme toggle
  - Notification bell
  - Responsive mobile sheet menu

## Admin Pages

Admin pages currently include:

- `Admin/Dashboard.jsx`
  - Metrics
  - Revenue chart
  - Booking chart
  - Recent activity
  - Upcoming schedules
  - Quick actions
- `Admin/Bookings/index.jsx`
  - Booking search and filters
  - Booking table
  - Payment/status badges
  - Action buttons
- `Admin/Calendar.jsx`
  - Local monthly scheduler
  - Booked, pending, and available session states
  - Add-session overlap check
- `Admin/Clients.jsx`
  - Client cards
  - Contact info
  - Booking counts
- `Admin/Files/index.jsx`
  - File/photo management UI
- `Admin/Payments/index.jsx`
  - Payment records
  - Revenue totals
  - Record payment and status actions
- `Admin/Reports.jsx`
  - Booking report
  - Revenue report
  - Client report
  - Daily/weekly/monthly/yearly filters
  - Monthly income chart
  - Bookings per month chart
  - Popular package chart
  - PDF export through browser print
  - Excel export through `.xls` download

## Client Pages

Client pages currently include:

- `User/Dashboard.jsx`
  - Upcoming session
  - Payment status
  - Delivered photos
  - Notifications summary
  - Tabs for bookings, photos, payments, and notifications
- `User/Bookings/index.jsx`
  - Client booking views
- `User/Photos/index.jsx`
  - Client photo/download views
- `User/Payments/index.jsx`
  - Client payment views

## Notification System

The notification system lives in `resources/js/components/Notifications/Notifications.jsx`.

It includes:

- Bell icon with unread badge count
- Booking approved notifications
- Payment reminders
- Upcoming schedule reminders
- Photos ready notifications
- Admin custom notification form
- Client notification list
- Mark one notification as read
- Mark all as read
- Local storage persistence
- Header dropdown and full notifications page support

Route:

- `/notifications`

## Reports System

The reports system lives in `resources/js/pages/Admin/Reports.jsx`.

It includes:

- Booking report
- Revenue report
- Client report
- Monthly income chart
- Bookings per month chart
- Popular package chart
- Filters: daily, weekly, monthly, yearly
- Export: PDF through print
- Export: Excel through `.xls`

Route:

- `/reports`

## Shared UI Components Added Or Restored

The project referenced some UI components that were missing. These are now present:

- `resources/js/components/ui/table.tsx`
- `resources/js/components/ui/tabs.tsx`
- `resources/js/components/ui/scroll-area.tsx`
- `resources/js/components/ui/progress.tsx`
- `resources/js/components/ui/chart.tsx`

Badge variants were expanded in `resources/js/components/ui/badge.tsx`:

- `success`
- `warning`

## Routes Added

Additional authenticated routes now include:

- `/dashboard` -> `Admin/Dashboard`
- `/notifications` -> `Notifications`
- `/reports` -> `Admin/Reports`
- `/bookings` -> `Admin/Bookings/index`
- `/calendar` -> `Admin/Calendar`
- `/clients` -> `Admin/Clients`
- `/files` -> `Admin/Files/index`
- `/payments` -> `Admin/Payments/index`
- `/my-bookings` -> `User/Bookings/index`
- `/my-photos` -> `User/Photos/index`
- `/my-payments` -> `User/Payments/index`

## Fixes Completed

- Restored missing dashboard UI dependencies so Vite can build.
- Replaced the uninstalled `react-big-calendar` dependency with a local calendar UI.
- Normalized `@/Layouts/DashboardLayout` imports to `@/layouts/DashboardLayout`.
- Changed client payments navigation from `/payments` to `/my-payments` to avoid colliding with admin payments.
- Updated profile links to `/settings/profile`.
- Enabled `RefreshDatabase` for feature tests in `tests/Pest.php`.
- Applied ESLint and Prettier formatting fixes across `resources/`.

## Verification Status

The following checks pass:

- `npm.cmd run lint:check`
- `npm.cmd run format:check`
- `npm.cmd run types:check`
- `npm.cmd run build`
- `php artisan test`

Build warnings remain for large JavaScript chunks, mainly the 3D/camera-related bundle. These are warnings, not errors.

## Known Next Improvements

- Replace demo/static data with real database-backed booking, payment, client, file, notification, and report models.
- Add role middleware so admin routes and client routes are protected separately.
- Add server-backed notification persistence instead of local storage.
- Add true PDF generation if exported reports need designed PDFs instead of browser print output.
- Consider code splitting the large 3D/camera bundle to reduce production build warnings.
