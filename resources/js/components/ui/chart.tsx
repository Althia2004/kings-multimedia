import * as React from "react"

type Dataset = {
  label?: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string
}

type ChartData = {
  labels: string[]
  datasets: Dataset[]
}

type ChartProps = {
  data: ChartData
}

function getColor(color: string | string[] | undefined, index: number, fallback: string) {
  if (Array.isArray(color)) {
    return color[index] || fallback
  }

  return color || fallback
}

function BarChart({ data }: ChartProps) {
  const dataset = data.datasets[0]
  const values = dataset?.data ?? []
  const maxValue = Math.max(...values, 1)

  return (
    <div className="space-y-4">
      {data.labels.map((label, index) => {
        const value = values[index] ?? 0
        const width = `${Math.max((value / maxValue) * 100, 6)}%`

        return (
          <div key={label} className="grid gap-2">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground">{value.toLocaleString()}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width,
                  backgroundColor: getColor(dataset?.backgroundColor, index, "#facc15"),
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LineChart({ data }: ChartProps) {
  const dataset = data.datasets[0]
  const values = dataset?.data ?? []
  const maxValue = Math.max(...values, 1)
  const minValue = Math.min(...values, 0)
  const range = Math.max(maxValue - minValue, 1)
  const width = 640
  const height = 220
  const padding = 24
  const pointGap = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0
  const points = values.map((value, index) => {
    const x = padding + index * pointGap
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2)

    return { x, y, value }
  })
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ")

  return (
    <div className="w-full overflow-x-auto">
      <svg
        role="img"
        aria-label={dataset?.label || "Line chart"}
        viewBox={`0 0 ${width} ${height}`}
        className="min-h-56 w-full"
      >
        <path d={path} fill="none" stroke={dataset?.borderColor || "#facc15"} strokeWidth="3" />
        {points.map((point, index) => (
          <g key={data.labels[index]}>
            <circle cx={point.x} cy={point.y} r="4" fill={dataset?.borderColor || "#facc15"} />
            <text x={point.x} y={height - 4} textAnchor="middle" className="fill-muted-foreground text-[12px]">
              {data.labels[index]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export { BarChart, LineChart }
