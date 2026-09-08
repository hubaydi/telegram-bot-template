import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import type { HydrateFlavor } from '@grammyjs/hydrate'
import type { I18nFlavor } from '@grammyjs/i18n'
import type { Context as DefaultContext, SessionFlavor } from 'grammy'
import type { Config } from '#root/config.js'
import type { Logger } from '#root/logger.js'

export interface SessionData {
  // field?: string;
}

interface ExtendedContextFlavor {
  logger: Logger
  config: Config
}

export type Context = HydrateFlavor<
  DefaultContext
  & ExtendedContextFlavor
  & SessionFlavor<SessionData>
  & I18nFlavor
  & AutoChatActionFlavor
>
