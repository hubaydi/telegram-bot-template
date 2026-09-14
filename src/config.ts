import process from 'node:process'
import { API_CONSTANTS } from 'grammy'
import { z } from 'zod'

const baseConfigSchema = z.object({
  debug: z.stringbool().default(false),
  logLevel: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent']).default('info'),
  botToken: z.string().regex(/^\d+:[\w-]+$/, 'Invalid token'),
  botAllowedUpdates: z.string().transform(json => JSON.parse(json)).pipe(z.array(z.enum(API_CONSTANTS.ALL_UPDATE_TYPES))).default([]),
  botAdmins: z.string().transform(json => JSON.parse(json)).pipe(z.array(z.number())).default([]),
  databaseFile: z.string().default('./data/bot.sqlite'),
})

const configSchema = z.discriminatedUnion('botMode', [
  // polling config
  z.object({
    botMode: z.literal('polling'),
    ...baseConfigSchema.shape,
  }).transform(input => ({
    ...input,
    isDebug: input.debug,
    isWebhookMode: false as const,
    isPollingMode: true as const,
  })),
  // webhook config
  z.object({
    botMode: z.literal('webhook'),
    ...baseConfigSchema.shape,
    botWebhook: z.url(),
    botWebhookSecret: z.string().min(12),
    serverHost: z.string().default('0.0.0.0'),
    serverPort: z.string().transform(Number).pipe(z.number()).default(80),
  }).transform(input => ({
    ...input,
    isDebug: input.debug,
    isWebhookMode: true as const,
    isPollingMode: false as const,
  })),
])

export type Config = z.output<typeof configSchema>
export type PollingConfig = z.output<(typeof configSchema)['options'][0]>
export type WebhookConfig = z.output<(typeof configSchema)['options'][1]>

export function createConfig(input: z.input<typeof configSchema>) {
  return configSchema.parse(input)
}

export const config = createConfigFromEnvironment()

function createConfigFromEnvironment() {
  type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
    : Lowercase<S>

  type KeysToCamelCase<T> = {
    [K in keyof T as CamelCase<string & K>]: T[K] extends object ? KeysToCamelCase<T[K]> : T[K]
  }

  function toCamelCase(str: string): string {
    return str.toLowerCase().replace(/_([a-z])/g, (_match, p1) => p1.toUpperCase())
  }

  function convertKeysToCamelCase<T extends object>(obj: T): KeysToCamelCase<T> {
    const result: any = {}
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        const camelCaseKey = toCamelCase(key)
        result[camelCaseKey] = obj[key]
      }
    }
    return result
  }

  try {
    process.loadEnvFile()
  }
  catch {
    // No .env file found
  }

  try {
    // @ts-expect-error create config from environment variables
    const config = createConfig(convertKeysToCamelCase(process.env))

    return config
  }
  catch (error) {
    throw new Error('Invalid config', {
      cause: error,
    })
  }
}
