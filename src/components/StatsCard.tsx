interface StatsCardProps {
    title: string
    value: string
    change: string
    isPositive?: boolean
  }
  
  export default function StatsCard({ title, value, change, isPositive = true }: StatsCardProps) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
          <div className={`mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </div>
        </div>
      </div>
    )
  }