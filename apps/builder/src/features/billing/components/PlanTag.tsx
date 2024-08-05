import { Tag, TagProps, ThemeTypings } from '@chakra-ui/react'
import { Plan } from '@typebot.io/prisma'

export const planColorSchemes: Record<Plan, ThemeTypings['colorSchemes']> = {
  [Plan.LIFETIME]: 'purple',
  [Plan.PRO]: 'blue',
  [Plan.OFFERED]: 'orange',
  [Plan.STARTER]: 'orange',
  [Plan.FREE]: 'gray',
  [Plan.CUSTOM]: 'yellow',
  [Plan.UNLIMITED]: 'yellow',
}

export const PlanTag = ({
  plan,
  ...props
}: { plan: Plan } & TagProps): JSX.Element => {
  switch (plan) {
    case Plan.LIFETIME: {
      return (
        <Tag
          colorScheme={planColorSchemes[plan]}
          data-testid="lifetime-plan-tag"
          {...props}
        >
          Lifetime
        </Tag>
      )
    }
    case Plan.PRO: {
      return (
        <Tag
          colorScheme={planColorSchemes[plan]}
          data-testid="pro-plan-tag"
          {...props}
        >
          Pro
        </Tag>
      )
    }
    case Plan.OFFERED:
    case Plan.STARTER: {
      return (
        <Tag
          colorScheme={planColorSchemes[plan]}
          data-testid="starter-plan-tag"
          {...props}
        >
          허용
        </Tag>
      )
    }
    case Plan.FREE: {
      return (
        <Tag
          colorScheme={planColorSchemes[Plan.FREE]}
          data-testid="free-plan-tag"
          {...props}
        >
          허용
        </Tag>
      )
    }
    case Plan.CUSTOM: {
      return (
        <Tag
          colorScheme={planColorSchemes[Plan.CUSTOM]}
          data-testid="custom-plan-tag"
          {...props}
        >
          커스텀
        </Tag>
      )
    }
    case Plan.UNLIMITED: {
      return (
        <Tag
          colorScheme={planColorSchemes[Plan.UNLIMITED]}
          data-testid="custom-unlimite-tag"
          {...props}
        >
          무제한
        </Tag>
      )
    }
  }
}
