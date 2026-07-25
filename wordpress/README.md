# 🌐 Ruqya Center — WordPress Migration Package

This directory contains the production-ready WordPress migration package for the **Ruqya Center (مركز الرقية بكلام الرحمن لرد كيد الشيطان)** system. 

It is designed to migrate all frontend pages, interactive dashboards, payment processes, and localized content from the original Next.js architecture to a robust, highly extensible, and maintainable **WordPress** installation while maintaining **100% feature parity** with the native application.

---

## 🏗️ Architecture & Integration

The system uses a **hybrid architecture** that combines WordPress's content management capabilities with the existing **Supabase** backend to keep all relational business data centralized.

```
                  ┌──────────────────────────────────────────┐
                  │            WordPress Frontend            │
                  │  (Custom Theme: ruqya-center / PHP-RTL)  │
                  └────────────────────┬─────────────────────┘
                                       │
                                       │ AJAX / REST API
                                       ▼
                  ┌──────────────────────────────────────────┐
                  │           Ruqya Center Core              │
                  │   (Custom Functionality Plugin)          │
                  └──────┬─────────────┬──────────────┬──────┘
                         │             │              │
                         │ SQL/REST    │ Webhooks     │ Mail API
                         ▼             ▼              ▼
                   ┌──────────┐  ┌───────────┐  ┌──────────┐
                   │ Supabase │  │  Mtjree   │  │  Resend  │
                   │ Database │  │  Gateway  │  │  Emails  │
                   └──────────┘  └───────────┘  └──────────┘
```

1. **Custom Theme (`ruqya-center`)**: Responsive, highly polished, optimized for RTL layouts (Arabic) and translated to LTR layouts (Turkish). Uses native WordPress templates and custom templates for individual pages.
2. **Custom Plugin (`ruqya-center-core`)**: Handles logic, integrates with Supabase REST API and PostgREST, manages Mtjree payments, processes REST webhooks, triggers Resend transactional emails, and creates the custom admin dashboards.

---

## ✨ Features Implemented

* **Multi-Language (AR / TR)**:
  * Full localization using Gettext translation wrappers (`__()`, `_e()`) for theme files.
  * Polylang integration for dynamic page translations and header language switching.
  * Loco Translate configuration readiness for translating static components.
* **Mtjree Payment Integration**:
  * Secure order generation and redirect to the Mtjree checkout portal.
  * Javascript `PaymentReturnDetector` on the booking page to catch returning users.
  * Secure AJAX verification on the result page querying Mtjree directly.
  * Webhook listener (`/wp-json/ruqya/v1/payment-webhook`) to receive asynchronous payment status updates.
* **Admin Dashboard (CRUD & Operations)**:
  * Comprehensive dashboard widgets and tabs.
  * Interactive **Patient Details Modal** displaying health details via secure AJAX.
  * Drag-and-drop or select **Assign Healer** action immediately syncing with Supabase.
  * **Bulk Slot Generator** generating schedules for specific healers, dates, times, and duration.
  * Native CRUD panels inside wp-admin to manage healers, services, testimonials, FAQs, and contact messages.
* **Healer Dashboard**:
  * Specialized dashboard panel for users with the custom role `ruqya_healer`.
  * Diagnostic access to patient medical details (Modal).
  * Status controls to mark sessions as "Completed" or "No Show".

---

## ⚙️ Environment Variables

The application reads configurations from server environment variables or `wp-config.php`.

| Constant Name | Description | Example / Default |
|---|---|---|
| `SUPABASE_URL` | The endpoint URL of your Supabase project | `https://xyz.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase Anonymous API key | `eyJhbGciOiJIUzI1...` |
| `SUPABASE_SERVICE_KEY` | Supabase Service Role key (needed for writes/bypassing RLS) | `eyJhbGciOiJIUzI1...` |
| `MTJREE_API_KEY` | Mtjree vendor integration API key | `147-17764552...` |
| `MTJREE_SHOP_URL` | Public store URL registered in Mtjree dashboard | `https://ruqyacenter.com` |
| `MTJREE_LOGO_URL` | Image URL of your logo displayed on Mtjree checkout | `https://ruqyacenter.com/logo.png` |
| `MTJREE_VENDOR_NAME` | The vendor name shown to the user during checkout | `Ruqya System` |
| `MTJREE_TEST_MODE` | Toggle Mtjree sandbox environment (`true` or `false`) | `true` |
| `RESEND_API_KEY` | Resend API Key for dispatching email confirmations | `re_YcMSq...` |
| `ADMIN_EMAIL` | Email address where booking/contact alerts are sent | `info@ruqyacenter.com` |

---

## 🚀 Local Installation (Docker)

To run the project locally for development and testing:

1. Make sure you have **Docker** and **Docker Compose** installed.
2. Duplicate the `.env.example` file and name it `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in the credentials (Supabase keys, Mtjree API keys, Resend credentials).
4. Spin up the containers:
   ```bash
   docker compose up -d
   ```
5. Access the installation:
   * **WordPress Frontend**: `http://localhost:8080`
   * **phpMyAdmin**: `http://localhost:8081` (Credentials: Username `ruqya`, Password `ruqya_secret_2024`)
6. Complete the famous 5-minute WordPress installation via your browser.
7. Go to **Plugins** and activate **Ruqya Center Core**. This will automatically create all necessary pages and configure templates.
8. Go to **Appearance → Themes** and activate **Ruqya Center**.

---

## 🌐 Production Deployment (Hostinger)

Follow these steps to deploy this package to **Hostinger** or any generic WordPress hosting provider:

### 1. Database & Core Setup
1. Log into your Hostinger hPanel.
2. Go to **Databases → MySQL Databases** and create a new database. Save the database name, user, and password.
3. Use the Hostinger **Auto Installer** to install a fresh copy of WordPress on `ruqyacenter.com`.

### 2. Configuration & Secrets
1. Open the **File Manager** on Hostinger and locate `public_html/wp-config.php`.
2. Insert the database connection settings provided by Hostinger.
3. Append your environment variables to the bottom of `wp-config.php` (just above the `/* That's all, stop editing! */` comment):
   ```php
   /* Supabase Integration */
   define( 'SUPABASE_URL', 'https://your-project.supabase.co' );
   define( 'SUPABASE_ANON_KEY', 'your-anon-key' );
   define( 'SUPABASE_SERVICE_KEY', 'your-service-role-key' );

   /* Mtjree Payment Gateway */
   define( 'MTJREE_API_KEY', 'your-production-api-key' );
   define( 'MTJREE_SHOP_URL', 'https://ruqyacenter.com' );
   define( 'MTJREE_LOGO_URL', 'https://ruqyacenter.com/logo.png' );
   define( 'MTJREE_VENDOR_NAME', 'مركز الرقية الشرعية' );
   define( 'MTJREE_TEST_MODE', false ); // MUST be false in production

   /* Resend Email Gateway */
   define( 'RESEND_API_KEY', 'your-resend-key' );
   define( 'ADMIN_EMAIL', 'admin@ruqyacenter.com' );
   ```

### 3. Uploading Code & Assets
1. Upload the custom plugin directory:
   * Source: `wordpress/wp-content/plugins/ruqya-center-core`
   * Destination: `/public_html/wp-content/plugins/ruqya-center-core`
2. Upload the custom theme directory:
   * Source: `wordpress/wp-content/themes/ruqya-center`
   * Destination: `/public_html/wp-content/themes/ruqya-center`

### 4. Activation & Verification
1. Access the WordPress admin dashboard (`/wp-admin`).
2. Go to **Plugins** and click **Activate** under **Ruqya Center Core**. *(This will programmatically verify and insert all necessary pages, assign their template files, and set the front page)*.
3. Go to **Appearance → Themes** and activate **Ruqya Center**.
4. Go to **Settings → Permalinks**, choose **Post Name** (`/%postname%/`), and click save.

### 5. Multi-Language Setup
1. Go to **Plugins → Add New**, search for **Polylang**, install and activate it.
2. In Polylang wizard, add two languages:
   * **Arabic** (Primary, default, locale `ar`)
   * **Turkish** (Locale `tr`)
3. Install and activate **Loco Translate**. Use it to translate static UI strings inside the theme context.

### 6. Payment Webhook Setup
1. Log into your **Mtjree Vendor Dashboard**.
2. Go to integration settings and locate the Webhook section.
3. Register your production webhook endpoint:
   ```
   https://ruqyacenter.com/wp-json/ruqya/v1/payment-webhook
   ```
4. Perform a real payment test to ensure the flow updates Supabase database status correctly.

---

## 🔒 Security Hardening

To guarantee safety for online consultations and medical booking data:
1. **Disable Code Editor**: The theme configuration explicitly sets `DISALLOW_FILE_EDIT` to `true` to block file editing through the dashboard.
2. **Force SSL**: Force secure connection in admin panel using `define('FORCE_SSL_ADMIN', true);`.
3. **REST API Authorization**: All custom endpoints utilize `permission_callback` checking for administrator tokens or valid request hashes before serving CRUD operations.
