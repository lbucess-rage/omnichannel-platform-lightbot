export const timeFilterValues = [
  'today',
  'last7Days',
  'last30Days',
  'monthToDate',
  'lastMonth',
  'yearToDate',
  'allTime',
] as const

export const timeFilterLabels: Record<
  (typeof timeFilterValues)[number],
  string
> = {
  today: '오늘',
  last7Days: '지난 7일',
  last30Days: '지난 30일',
  monthToDate: '이번 달',
  lastMonth: '지난 달',
  yearToDate: '올해',
  allTime: '전체',
}

export const defaultTimeFilter = 'last7Days' as const
