<?php

namespace App\Exports;

use Illuminate\Http\Response;
use ZipArchive;

class ReportsExport
{
    public function __construct(private readonly array $data)
    {
    }

    public function download(string $filename): Response
    {
        return response($this->generate(), 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
        ]);
    }

    private function generate(): string
    {
        $path = tempnam(sys_get_temp_dir(), 'kings-report-');
        $zip = new ZipArchive();
        $zip->open($path, ZipArchive::OVERWRITE);

        $sheets = [
            'Summary' => $this->summaryRows(),
            'Monthly Income' => $this->monthlyIncomeRows(),
            'Bookings Per Month' => $this->bookingsPerMonthRows(),
            'Popular Packages' => $this->popularPackageRows(),
            'Client Report' => $this->clientReportRows(),
        ];

        $zip->addFromString('[Content_Types].xml', $this->contentTypes(count($sheets)));
        $zip->addFromString('_rels/.rels', $this->rootRelationships());
        $zip->addFromString('xl/workbook.xml', $this->workbookXml(array_keys($sheets)));
        $zip->addFromString('xl/_rels/workbook.xml.rels', $this->workbookRelationships(count($sheets)));
        $zip->addFromString('xl/styles.xml', $this->stylesXml());

        foreach (array_values($sheets) as $index => $rows) {
            $zip->addFromString('xl/worksheets/sheet'.($index + 1).'.xml', $this->sheetXml($rows));
        }

        $zip->close();

        $contents = file_get_contents($path);
        @unlink($path);

        return $contents;
    }

    private function summaryRows(): array
    {
        return [
            [['Report Type', 's'], ['Value', 's']],
            [['Total Revenue', 's'], [$this->data['reports']['revenue'], 'n', 1]],
            [['Total Bookings', 's'], [$this->data['reports']['bookings'], 'n']],
            [['Total Clients', 's'], [$this->data['reports']['clients'], 'n']],
            [['Popular Package', 's'], [$this->data['reports']['popularPackage'], 's']],
        ];
    }

    private function monthlyIncomeRows(): array
    {
        $rows = [[['Month', 's'], ['Income', 's']]];

        foreach ($this->data['monthlyIncome'] as $row) {
            $rows[] = [[$row['label'], 's'], [$row['value'], 'n', 1]];
        }

        $rows[] = [['TOTAL', 's'], ['SUM(B2:B13)', 'f', 1]];

        return $rows;
    }

    private function bookingsPerMonthRows(): array
    {
        $rows = [[['Month', 's'], ['Bookings', 's']]];

        foreach ($this->data['bookingsPerMonth'] as $row) {
            $rows[] = [[$row['label'], 's'], [$row['value'], 'n']];
        }

        $rows[] = [['TOTAL', 's'], ['SUM(B2:B13)', 'f']];

        return $rows;
    }

    private function popularPackageRows(): array
    {
        $packages = $this->data['popularPackages'] ?: [
            ['label' => 'No bookings', 'value' => 0, 'percentage' => 0],
        ];
        $rows = [[['Package', 's'], ['Bookings', 's'], ['Percentage', 's']]];

        foreach ($packages as $row) {
            $rows[] = [[$row['label'], 's'], [$row['value'], 'n'], [$row['percentage'].'%', 's']];
        }

        $rows[] = [['TOTAL', 's'], ['SUM(B2:B100)', 'f'], ['', 's']];

        return $rows;
    }

    private function clientReportRows(): array
    {
        $clients = $this->data['clientRows'] ?: [
            ['client' => 'No clients', 'bookings' => 0, 'revenue' => 0, 'favoritePackage' => 'None', 'status' => 'Inactive'],
        ];
        $rows = [[['Client', 's'], ['Bookings', 's'], ['Revenue', 's'], ['Popular Package', 's'], ['Status', 's']]];

        foreach ($clients as $row) {
            $rows[] = [
                [$row['client'], 's'],
                [$row['bookings'], 'n'],
                [$row['revenue'], 'n', 1],
                [$row['favoritePackage'], 's'],
                [$row['status'], 's'],
            ];
        }

        $lastDataRow = count($clients) + 1;
        $rows[] = [
            ['TOTAL', 's'],
            ['SUM(B2:B'.$lastDataRow.')', 'f'],
            ['SUM(C2:C'.$lastDataRow.')', 'f', 1],
            ['', 's'],
            ['', 's'],
        ];

        return $rows;
    }

    private function sheetXml(array $rows): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
        $xml .= '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
        $xml .= '<sheetData>';

        foreach ($rows as $rowIndex => $row) {
            $excelRow = $rowIndex + 1;
            $xml .= '<row r="'.$excelRow.'">';

            foreach ($row as $columnIndex => $cell) {
                [$value, $type, $style] = [$cell[0], $cell[1] ?? 's', $cell[2] ?? null];
                $xml .= $this->cell($this->columnName($columnIndex + 1).$excelRow, $value, $type, $style);
            }

            $xml .= '</row>';
        }

        return $xml.'</sheetData></worksheet>';
    }

    private function cell(string $reference, mixed $value, string $type, ?int $style): string
    {
        $styleAttribute = $style ? ' s="'.$style.'"' : '';

        if ($type === 'f') {
            return '<c r="'.$reference.'"'.$styleAttribute.'><f>'.$this->escape($value).'</f></c>';
        }

        if ($type === 'n') {
            return '<c r="'.$reference.'"'.$styleAttribute.'><v>'.$value.'</v></c>';
        }

        return '<c r="'.$reference.'" t="inlineStr"'.$styleAttribute.'><is><t>'.$this->escape($value).'</t></is></c>';
    }

    private function contentTypes(int $sheetCount): string
    {
        $overrides = '';

        for ($sheet = 1; $sheet <= $sheetCount; $sheet++) {
            $overrides .= '<Override PartName="/xl/worksheets/sheet'.$sheet.'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
        }

        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            .'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            .'<Default Extension="xml" ContentType="application/xml"/>'
            .'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            .'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
            .$overrides
            .'</Types>';
    }

    private function rootRelationships(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            .'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            .'</Relationships>';
    }

    private function workbookXml(array $sheetNames): string
    {
        $sheets = '';

        foreach ($sheetNames as $index => $sheetName) {
            $sheetId = $index + 1;
            $sheets .= '<sheet name="'.$this->escape($sheetName).'" sheetId="'.$sheetId.'" r:id="rId'.$sheetId.'"/>';
        }

        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            .'<sheets>'.$sheets.'</sheets>'
            .'</workbook>';
    }

    private function workbookRelationships(int $sheetCount): string
    {
        $relationships = '';

        for ($sheet = 1; $sheet <= $sheetCount; $sheet++) {
            $relationships .= '<Relationship Id="rId'.$sheet.'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'.$sheet.'.xml"/>';
        }

        $relationships .= '<Relationship Id="rId'.($sheetCount + 1).'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>';

        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            .$relationships
            .'</Relationships>';
    }

    private function stylesXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            .'<numFmts count="1"><numFmt numFmtId="164" formatCode="₱#,##0.00"/></numFmts>'
            .'<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>'
            .'<fills count="1"><fill><patternFill patternType="none"/></fill></fills>'
            .'<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
            .'<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
            .'<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>'
            .'</styleSheet>';
    }

    private function columnName(int $number): string
    {
        $name = '';

        while ($number > 0) {
            $number--;
            $name = chr(65 + ($number % 26)).$name;
            $number = intdiv($number, 26);
        }

        return $name;
    }

    private function escape(mixed $value): string
    {
        return htmlspecialchars((string) $value, ENT_XML1 | ENT_COMPAT, 'UTF-8');
    }
}
