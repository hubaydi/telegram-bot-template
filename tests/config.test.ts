import { describe, expect, it } from 'vitest'

process.env.BOT_TOKEN = '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'
process.env.BOT_MODE = 'polling'

const { createConfig } = await import('../src/config.js')

describe('createConfig', () => {
  it('parses polling config with defaults', () => {
    const config = createConfig({ botMode: 'polling', botToken: '123456:ABC-DEF' })

    expect(config).toMatchObject({
      botMode: 'polling',
      debug: false,
      logLevel: 'info',
      botAllowedUpdates: [],
      botAdmins: [],
      isDebug: false,
      isPollingMode: true,
      isWebhookMode: false,
    })
  })

  it('parses webhook config', () => {
    const config = createConfig({
      botMode: 'webhook',
      botToken: '123456:ABC-DEF',
      debug: 'true',
      botAdmins: '[1, 2]',
      botWebhook: 'https://example.com/webhook',
      botWebhookSecret: 'secret-secret-secret',
      serverPort: '8443',
    })

    expect(config).toMatchObject({
      serverHost: '0.0.0.0',
      serverPort: 8443,
      debug: true,
      isDebug: true,
      botAdmins: [1, 2],
      isWebhookMode: true,
      isPollingMode: false,
    })
  })

  it('rejects invalid token', () => {
    expect(() => createConfig({ botMode: 'polling', botToken: 'invalid' })).toThrow()
  })

  it('rejects short webhook secret', () => {
    expect(() => createConfig({
      botMode: 'webhook',
      botToken: '123456:ABC-DEF',
      botWebhook: 'https://example.com/webhook',
      botWebhookSecret: 'short',
    })).toThrow()
  })
})
