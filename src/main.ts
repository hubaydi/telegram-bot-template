#!/usr/bin/env tsx
/* eslint-disable antfu/no-top-level-await */

import type { RunnerHandle } from '@grammyjs/runner'
import type { PollingConfig, WebhookConfig } from '#root/config.js'
import type { Database } from '#root/db/client.js'
import process from 'node:process'
import { run } from '@grammyjs/runner'
import { createBot } from '#root/bot/index.js'
import { config } from '#root/config.js'
import { createDatabase } from '#root/db/client.js'
import { runMigrations } from '#root/db/migrate.js'
import { logger } from '#root/logger.js'
import { createServer, createServerManager } from '#root/server/index.js'

async function startPolling(config: PollingConfig, db: Database) {
  const bot = createBot(config.botToken, {
    config,
    logger,
    db,
  })
  let runner: undefined | RunnerHandle

  // graceful shutdown
  onShutdown(async () => {
    logger.info('Shutdown')
    await runner?.stop()
  })

  await Promise.all([
    bot.init(),
    bot.api.deleteWebhook(),
  ])

  // start bot
  runner = run(bot, {
    runner: {
      fetch: {
        allowed_updates: config.botAllowedUpdates,
      },
    },
  })

  logger.info({
    msg: 'Bot running...',
    username: bot.botInfo.username,
  })
}

async function startWebhook(config: WebhookConfig, db: Database) {
  const bot = createBot(config.botToken, {
    config,
    logger,
    db,
  })
  const server = createServer({
    bot,
    config,
    logger,
  })
  const serverManager = createServerManager(server, {
    host: config.serverHost,
    port: config.serverPort,
  })

  // graceful shutdown
  onShutdown(async () => {
    logger.info('Shutdown')
    await serverManager.stop()
  })

  // to prevent receiving updates before the bot is ready
  await bot.init()

  // start server
  const info = await serverManager.start()
  logger.info({
    msg: 'Server started',
    url: info.url,
  })

  // set webhook
  await bot.api.setWebhook(config.botWebhook, {
    allowed_updates: config.botAllowedUpdates,
    secret_token: config.botWebhookSecret,
  })
  logger.info({
    msg: 'Webhook was set',
    url: config.botWebhook,
  })
}

try {
  const db = createDatabase(config.databaseFile)
  runMigrations(db)

  if (config.isWebhookMode)
    await startWebhook(config, db)
  else if (config.isPollingMode)
    await startPolling(config, db)
}
catch (error) {
  logger.error(error)
  process.exit(1)
}

// Utils

function onShutdown(cleanUp: () => Promise<void>) {
  let isShuttingDown = false
  const handleShutdown = async () => {
    if (isShuttingDown)
      return
    isShuttingDown = true
    await cleanUp()
  }
  process.on('SIGINT', handleShutdown)
  process.on('SIGTERM', handleShutdown)
}
