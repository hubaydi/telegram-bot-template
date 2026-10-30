<h1 align="center">🤖 Telegram Bot Template</h1>

<img align="right" width="35%" alt="Telegram bot screenshot" src="https://github.com/bot-base/telegram-bot-template/assets/26162440/c4371683-3e99-4b1c-ae8e-11ccbea78f4b">

Bot starter template based on [grammY](https://grammy.dev/) bot framework.

## Features

- Scalable structure
- Config loading and validation
- Internationalization, language changing
- Graceful shutdown
- Logger (powered by [pino](https://github.com/pinojs/pino))
- Ultrafast and multi-runtime server (powered by [hono](https://github.com/honojs/hono))
- SQLite persistence with [Drizzle ORM](https://orm.drizzle.team/): sessions and a user repository
- Tests with [Vitest](https://vitest.dev/)

## Usage

Follow these steps to set up and run your bot using this template:

1. **Create a New Repository**

    Start by creating a new repository using this template. You can do this by clicking [here](https://github.com/hubaydi/telegram-bot-template/generate).

2. **Environment Variables Setup**

    Create an environment variables file by copying the provided example file:
     ```bash
     cp .env.example .env
     ```
    Open the newly created `.env` file and set the `BOT_TOKEN` environment variable.

3. **Launching the Bot**

    This template uses [pnpm](https://pnpm.io/) as its package manager. If you don't have it installed, run `npm install -g pnpm` first.

    You can run your bot in both development and production modes.

    **Development Mode:**

    Install the required dependencies:
    ```bash
    pnpm install
    ```
    Start the bot in watch mode (auto-reload when code changes):
    ```bash
    pnpm run dev
    ```

   **Production Mode:**

    Install only production dependencies:
    ```bash
    pnpm install --prod
    ```

    Set `DEBUG` environment variable to `false` in your `.env` file.

    Start the bot in production mode:
    ```bash
    pnpm run start:force # skip type checking and start
    # or
    pnpm start # with type checking (requires development dependencies)
    ```

### List of Available Commands

- `pnpm run lint` — Lint source code.
- `pnpm run format` — Format source code.
- `pnpm run typecheck` — Run type checking.
- `pnpm run test` — Run tests (vitest).
- `pnpm run test:watch` — Run tests in watch mode.
- `pnpm run dev` — Start the bot in development mode.
- `pnpm run start` — Start the bot.
- `pnpm run start:force` — Starts the bot without type checking.

### Directory Structure

```
project-root/
  ├── drizzle   # Generated SQL migrations
  ├── locales   # Localization files
  ├── tests     # Standalone tests
  └── src
      ├── bot # Code related to bot
      │   ├── callback-data # Callback data builders
      │   ├── features      # Bot features
      │   ├── filters       # Update filters
      │   ├── handlers      # Update handlers
      │   ├── helpers       # Helper functions
      │   ├── keyboards     # Keyboard builders
      │   ├── middlewares   # Bot middlewares
      │   ├── i18n.ts       # Internationalization setup
      │   ├── context.ts    # Context object definition
      │   └── index.ts      # Bot entry point
      ├── db # SQLite client, schema, migrations, repositories
      ├── server # Code related to web server
      │   ├── middlewares   # Server middlewares
      │   ├── environment   # Server environment setup
      │   └── index.ts      # Server entry point
      ├── config.ts # Application config
      ├── logger.ts # Logging setup
      └── main.ts   # Application entry point
```

## Deploy

This fork does not carry the upstream `deploy/*` or `example/*` branches. Deploy it like any Node app: run `pnpm install --prod`, set `BOT_MODE=webhook` plus the `BOT_WEBHOOK*` variables, then `pnpm run start:force`.

The Docker, Vercel, Prisma, and Bun variants live in [bot-base/telegram-bot-template](https://github.com/bot-base/telegram-bot-template#deploy). They assume npm and valibot, so expect conflicts if you merge them into this fork.

## Environment Variables

<table>
<thead>
  <tr>
    <th>Variable</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>BOT_TOKEN</td>
    <td>
        String
    </td>
    <td>
        Telegram Bot API token obtained from <a href="https://t.me/BotFather">@BotFather</a>.
    </td>
  </tr>
  <tr>
    <td>BOT_MODE</td>
    <td>
        String
    </td>
    <td>
        Specifies method to receive incoming updates (<code>polling</code> or <code>webhook</code>).
    </td>
  </tr>
  <tr>
    <td>LOG_LEVEL</td>
    <td>
        String
    </td>
    <td>
        <i>Optional.</i>
        Specifies the application log level. <br/>
        Use <code>info</code> for general logging. Check the <a href="https://github.com/pinojs/pino/blob/master/docs/api.md#level-string">Pino documentation</a> for more log level options. <br/>
        Defaults to <code>info</code>.
    </td>
  </tr>
  <tr>
    <td>DEBUG</td>
    <td>Boolean</td>
    <td>
      <i>Optional.</i>
      Enables debug mode. You may use <code>config.isDebug</code> flag to enable debugging functions.
    </td>
  </tr>
  <tr>
    <td>BOT_WEBHOOK</td>
    <td>
        String
    </td>
    <td>
        <i>Optional in <code>polling</code> mode.</i>
        Webhook endpoint URL, used to configure webhook.
    </td>
  </tr>
  <tr>
    <td>BOT_WEBHOOK_SECRET</td>
    <td>
        String
    </td>
    <td>
        <i>Optional in <code>polling</code> mode.</i>
        A secret token that is used to ensure that a request is sent from Telegram, used to configure webhook.
    </td>
  </tr>
  <tr>
    <td>SERVER_HOST</td>
    <td>
        String
    </td>
    <td>
        <i>Optional in <code>polling</code> mode.</i> Specifies the server hostname. <br/>
        Defaults to <code>0.0.0.0</code>.
    </td>
  </tr>
  <tr>
    <td>SERVER_PORT</td>
    <td>
        Number
    </td>
    <td>
        <i>Optional in <code>polling</code> mode.</i> Specifies the server port. <br/>
        Defaults to <code>80</code>.
    </td>
  </tr>
  <tr>
    <td>BOT_ALLOWED_UPDATES</td>
    <td>
        Array of String
    </td>
    <td>
        <i>Optional.</i> A JSON-serialized list of the update types you want your bot to receive. See <a href="https://core.telegram.org/bots/api#update">Update</a> for a complete list of available update types. <br/>
        Defaults to an empty array (all update types except <code>chat_member</code>, <code>message_reaction</code> and <code>message_reaction_count</code>).
    </td>
  </tr>
  <tr>
    <td>BOT_ADMINS</td>
    <td>
        Array of Number
    </td>
    <td>
        <i>Optional.</i>
        Administrator user IDs.
        Use this to specify user IDs that have special privileges, such as executing <code>/setcommands</code>. <br/>
        Defaults to an empty array.
    </td>
  </tr>
  <tr>
    <td>DATABASE_FILE</td>
    <td>
        String
    </td>
    <td>
        <i>Optional.</i>
        Path to the SQLite database file. The directory is created on startup. <br/>
        Defaults to <code>./data/bot.sqlite</code>.
    </td>
  </tr>
</tbody>
</table>
