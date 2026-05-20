<?php

namespace App\Http\Controllers;

use App\Exports\ReportsExport;
use App\Models\Booking;
use App\Models\Client;
use App\Models\Payment;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return $this->index($request);
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Reports', $this->reportData($request));
    }

    public function exportExcel(Request $request)
    {
        $data = $this->reportData($request);
        $filename = 'kings-media-report-'.now()->toDateString().'.xlsx';

        return (new ReportsExport($data))->download($filename);
    }

    public function exportPdf(Request $request)
    {
        $data = $this->reportData($request);
        $filename = 'kings-media-report-'.now()->toDateString().'.pdf';

        if (class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
            return \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.admin-report', $data)
                ->setPaper('a4')
                ->download($filename);
        }

        return response($this->simplePdf($data), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }

    private function reportData(Request $request): array
    {
        $range = $request->string('range', 'monthly')->toString();
        $range = in_array($range, ['daily', 'weekly', 'monthly', 'yearly'], true) ? $range : 'monthly';
        [$start, $end] = $this->dateRange($range);
        $rangeLabel = $start->format('M d, Y').' - '.$end->format('M d, Y');

        $totalRevenue = (float) Payment::whereBetween('created_at', [$start, $end])->sum('amount_paid');
        $totalBookings = Booking::whereBetween('created_at', [$start, $end])->count();
        $totalClients = Client::whereBetween('created_at', [$start, $end])->count();
        $outstanding = (float) Payment::where('status', '!=', 'Paid')->sum('remaining_balance');

        $popularPackages = $this->popularPackages($start, $end);
        $popularPackage = $popularPackages[0]['label'] ?? 'No bookings yet';

        return [
            'range' => $range,
            'rangeLabel' => $rangeLabel,
            'reportDate' => now()->format('F d, Y'),
            'reports' => [
                'revenue' => $totalRevenue,
                'bookings' => $totalBookings,
                'clients' => $totalClients,
                'outstanding' => $outstanding,
                'popularPackage' => $popularPackage,
            ],
            'monthlyIncome' => $this->monthlyIncome(),
            'bookingsPerMonth' => $this->bookingsPerMonth(),
            'popularPackages' => $popularPackages,
            'clientRows' => $this->clientRows($start, $end),
            'bookingBreakdown' => Booking::selectRaw('status as label, COUNT(*) as value')
                ->whereBetween('created_at', [$start, $end])
                ->groupBy('status')
                ->orderByDesc('value')
                ->get(),
        ];
    }

    private function dateRange(string $range): array
    {
        $now = CarbonImmutable::now();

        return match ($range) {
            'daily' => [$now->startOfDay(), $now->endOfDay()],
            'weekly' => [$now->startOfWeek(), $now->endOfWeek()],
            'yearly' => [$now->startOfYear(), $now->endOfYear()],
            default => [$now->startOfMonth(), $now->endOfMonth()],
        };
    }

    private function monthlyIncome(): array
    {
        $year = now()->year;

        return collect(range(1, 12))->map(function (int $month) use ($year) {
            $start = CarbonImmutable::create($year, $month, 1)->startOfMonth();
            $end = $start->endOfMonth();

            return [
                'label' => $start->format('M'),
                'value' => (float) Payment::whereBetween('created_at', [$start, $end])->sum('amount_paid'),
            ];
        })->all();
    }

    private function bookingsPerMonth(): array
    {
        $year = now()->year;

        return collect(range(1, 12))->map(function (int $month) use ($year) {
            $start = CarbonImmutable::create($year, $month, 1)->startOfMonth();
            $end = $start->endOfMonth();

            return [
                'label' => $start->format('M'),
                'value' => Booking::whereBetween('created_at', [$start, $end])->count(),
            ];
        })->all();
    }

    private function popularPackages(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $rows = Booking::selectRaw('event_type as label, COUNT(*) as value')
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('event_type')
            ->orderByDesc('value')
            ->get()
            ->map(fn ($row) => [
                'label' => $row->label ?: 'Unspecified',
                'value' => (int) $row->value,
            ]);

        $total = max($rows->sum('value'), 1);

        return $rows
            ->map(fn (array $row) => [
                ...$row,
                'percentage' => round(($row['value'] / $total) * 100, 2),
            ])
            ->values()
            ->all();
    }

    private function clientRows(CarbonImmutable $start, CarbonImmutable $end): array
    {
        return Client::with(['user', 'bookings.payment'])
            ->get()
            ->map(function (Client $client) use ($start, $end) {
                $bookings = $client->bookings->filter(
                    fn (Booking $booking) => $booking->created_at->betweenIncluded($start, $end)
                );
                $packageCounts = $bookings->countBy(fn (Booking $booking) => $booking->event_type ?: 'Unspecified');

                return [
                    'client' => $client->user?->name ?? 'Client #'.$client->id,
                    'bookings' => $bookings->count(),
                    'revenue' => (float) $bookings->sum(fn (Booking $booking) => (float) ($booking->payment?->amount_paid ?? 0)),
                    'favoritePackage' => $packageCounts->sortDesc()->keys()->first() ?? 'None',
                    'status' => $bookings->isNotEmpty() ? 'Active' : 'Inactive',
                ];
            })
            ->sortByDesc('revenue')
            ->values()
            ->all();
    }

    private function simplePdf(array $data): string
    {
        $lines = [
            'Kings Media / TheKingsVault',
            'Report date: '.$data['reportDate'],
            'Selected range: '.$data['rangeLabel'],
            '',
            'Total Revenue: '.$this->peso($data['reports']['revenue']),
            'Total Bookings: '.$data['reports']['bookings'],
            'Total Clients: '.$data['reports']['clients'],
            'Popular Package: '.$data['reports']['popularPackage'],
            '',
            'Monthly Income',
            ...array_map(fn ($row) => $row['label'].' - '.$this->peso($row['value']), $data['monthlyIncome']),
            '',
            'Bookings Per Month',
            ...array_map(fn ($row) => $row['label'].' - '.$row['value'], $data['bookingsPerMonth']),
            '',
            'Popular Packages',
            ...array_map(fn ($row) => $row['label'].' - '.$row['value'].' bookings - '.$row['percentage'].'%', $data['popularPackages']),
            '',
            'Client Report',
            ...array_map(fn ($row) => $row['client'].' - '.$row['bookings'].' bookings - '.$this->peso($row['revenue']).' - '.$row['favoritePackage'].' - '.$row['status'], $data['clientRows']),
        ];

        $objects = [];
        $content = "BT\n/F1 10 Tf\n40 800 Td\n";

        foreach ($lines as $index => $line) {
            if ($index > 0) {
                $content .= "0 -14 Td\n";
            }

            $content .= '<'.strtoupper(bin2hex(iconv('UTF-8', 'UTF-16BE', $line)))."> Tj\n";
        }

        $content .= "ET";
        $objects[] = "<< /Type /Catalog /Pages 2 0 R >>";
        $objects[] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";
        $objects[] = "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>";
        $objects[] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
        $objects[] = "<< /Length ".strlen($content)." >>\nstream\n".$content."\nendstream";

        $pdf = "%PDF-1.4\n";
        $offsets = [0];

        foreach ($objects as $number => $object) {
            $offsets[] = strlen($pdf);
            $pdf .= ($number + 1)." 0 obj\n".$object."\nendobj\n";
        }

        $xref = strlen($pdf);
        $pdf .= "xref\n0 ".(count($objects) + 1)."\n0000000000 65535 f \n";

        foreach (array_slice($offsets, 1) as $offset) {
            $pdf .= sprintf("%010d 00000 n \n", $offset);
        }

        return $pdf."trailer\n<< /Size ".(count($objects) + 1)." /Root 1 0 R >>\nstartxref\n".$xref."\n%%EOF";
    }

    private function peso(float $value): string
    {
        return '₱'.number_format($value, 2);
    }
}
