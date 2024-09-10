export const timeDifference = (createdAt: string): string => {
  const createdDate = new Date(createdAt)
  const now = new Date()

  const diffInMs = now.getTime() - createdDate.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  // 일 단위 차이
  if (diffInDays > 0) {
    return `${diffInDays}일 전`
  }
  // 시간 단위 차이
  else if (diffInHours > 0) {
    return `${diffInHours}시간 전`
  }
  // 분 단위 차이
  else if (diffInMinutes > 0) {
    return `${diffInMinutes}분 전`
  }
  // 현재 시점과 동일할 때
  else {
    return '방금 전'
  }
}
