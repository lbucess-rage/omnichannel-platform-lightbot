export type TemplateProps = {
  name: string
  emoji: string
  fileName: string
  description: string
  category?: 'marketing' | 'product' | 'omnichannel'
  isComingSoon?: boolean
  isNew?: boolean
  backgroundColor?: string
}
