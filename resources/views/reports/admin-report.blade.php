<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Kings Media Report</title>
    <style>
        body {
            color: #111827;
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.45;
        }

        h1 {
            font-size: 24px;
            margin: 0 0 4px;
        }

        h2 {
            border-bottom: 1px solid #d1d5db;
            font-size: 15px;
            margin: 24px 0 8px;
            padding-bottom: 4px;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th,
        td {
            border: 1px solid #d1d5db;
            padding: 6px 8px;
            text-align: left;
        }

        th {
            background: #f3f4f6;
            font-weight: 700;
        }

        .summary {
            display: table;
            margin-top: 16px;
            width: 100%;
        }

        .summary div {
            border: 1px solid #d1d5db;
            display: table-cell;
            padding: 10px;
            width: 25%;
        }

        .label {
            color: #6b7280;
            display: block;
            font-size: 10px;
            text-transform: uppercase;
        }

        .value {
            display: block;
            font-size: 16px;
            font-weight: 700;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <h1>Kings Media / TheKingsVault</h1>
    <div>Report date: {{ $reportDate }}</div>
    <div>Selected range: {{ $rangeLabel }}</div>

    <div class="summary">
        <div>
            <span class="label">Total Revenue</span>
            <span class="value">₱{{ number_format($reports['revenue'], 2) }}</span>
        </div>
        <div>
            <span class="label">Total Bookings</span>
            <span class="value">{{ number_format($reports['bookings']) }}</span>
        </div>
        <div>
            <span class="label">Total Clients</span>
            <span class="value">{{ number_format($reports['clients']) }}</span>
        </div>
        <div>
            <span class="label">Popular Package</span>
            <span class="value">{{ $reports['popularPackage'] }}</span>
        </div>
    </div>

    <h2>Monthly Income</h2>
    <table>
        <thead>
            <tr>
                <th>Month</th>
                <th>Income</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($monthlyIncome as $row)
                <tr>
                    <td>{{ $row['label'] }}</td>
                    <td>₱{{ number_format($row['value'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h2>Bookings Per Month</h2>
    <table>
        <thead>
            <tr>
                <th>Month</th>
                <th>Bookings</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($bookingsPerMonth as $row)
                <tr>
                    <td>{{ $row['label'] }}</td>
                    <td>{{ number_format($row['value']) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h2>Popular Packages</h2>
    <table>
        <thead>
            <tr>
                <th>Package</th>
                <th>Bookings</th>
                <th>Percentage</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($popularPackages as $row)
                <tr>
                    <td>{{ $row['label'] }}</td>
                    <td>{{ number_format($row['value']) }}</td>
                    <td>{{ $row['percentage'] }}%</td>
                </tr>
            @empty
                <tr>
                    <td colspan="3">No bookings found.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <h2>Client Report</h2>
    <table>
        <thead>
            <tr>
                <th>Client</th>
                <th>Bookings</th>
                <th>Revenue</th>
                <th>Popular Package</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($clientRows as $row)
                <tr>
                    <td>{{ $row['client'] }}</td>
                    <td>{{ number_format($row['bookings']) }}</td>
                    <td>₱{{ number_format($row['revenue'], 2) }}</td>
                    <td>{{ $row['favoritePackage'] }}</td>
                    <td>{{ $row['status'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5">No clients found.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
