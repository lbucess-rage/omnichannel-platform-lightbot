import { TemplateProps } from '../types'
import { useTranslate } from '@tolgee/react'

export const useTemplates = (): TemplateProps[] => {
  const { t } = useTranslate()

  return [
    // Omnichannel category
    {
      name: t('templates.modal.omnichannel.chatChannel.name'),
      emoji: '💬',
      fileName: 'omnichannel-chat-channel.json',
      category: 'omnichannel',
      description: t('templates.modal.omnichannel.chatChannel.description'),
    },

    // Marketing category
    {
      name: t('templates.modal.marketing.leadGeneration.name'),
      emoji: '🤝',
      fileName: 'lead-gen.json',
      category: 'marketing',
      description: t('templates.modal.marketing.leadGeneration.description'),
    },
    {
      name: t('templates.modal.marketing.quiz.name'),
      emoji: '🕹️',
      fileName: 'quiz.json',
      category: 'marketing',
      description: t('templates.modal.marketing.quiz.description'),
    },
    // {
    //   name: t('templates.modal.marketing.leadScoring.name'),
    //   emoji: '🏆',
    //   fileName: 'lead-scoring.json',
    //   category: 'marketing',
    //   description: t('templates.modal.marketing.leadScoring.description'),
    // },
    {
      name: t('templates.modal.marketing.leadMagnet.name'),
      emoji: '🧲',
      fileName: 'lead-magnet.json',
      category: 'marketing',
      description: t('templates.modal.marketing.leadMagnet.description'),
    },
    {
      name: t('templates.modal.marketing.productRecommendation.name'),
      emoji: '🍫',
      fileName: 'product-recommendation.json',
      category: 'marketing',
      description: t(
        'templates.modal.marketing.productRecommendation.description'
      ),
      backgroundColor: '#010000',
    },
    {
      name: t('templates.modal.marketing.leadGenWithAi.name'),
      emoji: '🦾',
      fileName: 'lead-gen-ai.json',
      category: 'marketing',
      description: t('templates.modal.marketing.leadGenWithAi.description'),
    },
    // {
    //   name: t('templates.modal.marketing.insuranceOffer.name'),
    //   emoji: '🐶',
    //   fileName: 'dog-insurance-offer.json',
    //   category: 'marketing',
    //   description: t('templates.modal.marketing.insuranceOffer.description'),
    // },
    // Product category
    {
      name: t('templates.modal.product.customerSupport.name'),
      emoji: '😍',
      fileName: 'customer-support.json',
      category: 'product',
      description: t('templates.modal.product.customerSupport.description'),
    },
    {
      name: t('templates.modal.product.npsSurvey.name'),
      emoji: '⭐',
      fileName: 'nps.json',
      category: 'product',
      description: t('templates.modal.product.npsSurvey.description'),
    },
    {
      name: t('templates.modal.product.userOnboarding.name'),
      emoji: '🧑‍🚀',
      fileName: 'onboarding.json',
      category: 'product',
      description: t('templates.modal.product.userOnboarding.description'),
    },
    {
      name: t('templates.modal.product.faq.name'),
      emoji: '💬',
      fileName: 'faq.json',
      category: 'product',
      description: t('templates.modal.product.faq.description'),
    },
    // Other category
    {
      name: t('templates.modal.other.digitalProductPayment.name'),
      emoji: '🖼️',
      fileName: 'digital-product-payment.json',
      description: t('templates.modal.other.digitalProductPayment.description'),
    },
    {
      name: t('templates.modal.other.movieRecommendation.name'),
      emoji: '🍿',
      fileName: 'movie-recommendation.json',
      description: t('templates.modal.other.movieRecommendation.description'),
    },
    {
      name: t('templates.modal.other.basicChatGpt.name'),
      emoji: '🤖',
      fileName: 'basic-chat-gpt.json',
      description: t('templates.modal.other.basicChatGpt.description'),
    },
    {
      name: t('templates.modal.other.audioChatGpt.name'),
      emoji: '🤖',
      fileName: 'audio-chat-gpt.json',
      description: t('templates.modal.other.audioChatGpt.description'),
    },
    {
      name: t('templates.modal.other.chatGptPersonas.name'),
      emoji: '🎭',
      fileName: 'chat-gpt-personas.json',
      description: t('templates.modal.other.chatGptPersonas.description'),
    },
    {
      name: t('templates.modal.other.openAiConditions.name'),
      emoji: '🧠',
      fileName: 'openai-conditions.json',
      description: t('templates.modal.other.openAiConditions.description'),
    },
    // {
    //   name: 'High ticket lead follow-up',
    //   emoji: '📞',
    //   isNew: true,
    //   fileName: 'high-ticket-lead-follow-up.json',
    //   category: 'marketing',
    //   description:
    //     'Simulates a bot that could be triggered after a high ticket lead just downloaded a lead magnet. This bot asks questions about the prospect business and their needs. Every question are powered with AI blocks to make the conversation more engaging and human-like.',
    // },
    {
      name: '빠른 탄수화물 계산기(openai 활용)',
      emoji: '🏃‍♂️',
      isNew: true,
      fileName: 'quick-carb-calculator.json',
      category: 'marketing',
      description:
        '활동적인 관객을 유치하고 참여시키려는 운동선수 연료 브랜드를 위해 특별히 설계된 이 챗봇은 사용자 입력에 기반한 즉각적이고 맞춤형 탄수화물 섭취 권장사항을 제공하여 효과적인 리드 마그넷 역할을 합니다.',
    },
    {
      name: '피부 유형 분석 봇',
      emoji: '💆‍♀️',
      isNew: true,
      fileName: 'skin-typology.json',
      category: 'marketing',
      description:
        '피부 유형 전문가 챗봇! Typology를 위한 리드 마그넷으로 설계된 이 봇은 사용자의 고유한 피부 유형을 결정하기 위해 일련의 맞춤형 질문을 합니다. 그런 다음, 상세한 진단과 맞춤형 AI 기반 스킨케어 추천을 제공합니다.',
    },
    {
      name: 'OpenAI Assistant Chat',
      emoji: '🤖',
      fileName: 'openai-assistant-chat.json',
      description: 'OpenAI assistant와의 대화를 시작할 수 있는 챗봇입니다.',
    },
    {
      name: '비용 절감 추정기',
      emoji: '💰',
      fileName: 'savings-estimator.json',
      isNew: true,
      category: 'marketing',
      description:
        '이 봇은 재사용 가능한 스펀지와 종이 타월을 판매하는 상점인 INGA를 위해 작동합니다. INGA 제품을 구입할 경우 사용자의 잠재적 절감을 추정하기 위해 간단한 질문을 합니다.',
    },
  ]
}
