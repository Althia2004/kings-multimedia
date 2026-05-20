# Report Export Package Setup

The report exports are implemented with real database data.

For package-backed Excel/PDF exports, install these packages when the project PHP version supports their dependency constraints:

```bash
composer require maatwebsite/excel barryvdh/laravel-dompdf
```

During this update, Composer could not install `maatwebsite/excel` on PHP 8.5.4 because its spreadsheet dependency currently requires PHP `<8.5.0`. The application includes local XLSX/PDF export fallbacks so the admin report buttons still download real reports without fake data.
