import { option, createAction } from '@typebot.io/forge'
import { auth } from '../auth'
import OpenAI, { ClientOptions, toFile } from 'openai'
import { baseOptions } from '../baseOptions'
import { defaultOpenAIOptions } from '../constants'
import { isNotEmpty } from '@typebot.io/lib'

export const createTranscription = createAction({
  name: 'Create Transcription',
  auth,
  baseOptions,
  options: option.object({
    url: option.string.layout({
      label: 'Audio URL',
    }),
    transcriptionVariableId: option.string.layout({
      label: '결과 저장 변수 ID',
      inputType: 'variableDropdown',
    }),
  }),

  getSetVariableIds: (options) =>
    options.transcriptionVariableId ? [options.transcriptionVariableId] : [],

  run: {
    server: async ({ credentials: { apiKey }, options, variables, logs }) => {
      if (!options.url) return logs.add('Audio URL is empty')
      if (!options.transcriptionVariableId)
        return logs.add('Transcription Variable ID is empty')

      const config = {
        apiKey,
        baseURL: options.baseUrl ?? defaultOpenAIOptions.baseUrl,
        defaultHeaders: {
          'api-key': apiKey,
        },
        defaultQuery: isNotEmpty(options.apiVersion)
          ? {
              'api-version': options.apiVersion,
            }
          : undefined,
      } satisfies ClientOptions

      const openai = new OpenAI(config)

      const result = await openai.audio.transcriptions.create({
        file: await fetch(options.url),
        model: 'whisper-1',
      })

      variables.set(options.transcriptionVariableId, result.text)
    },
  },
})
