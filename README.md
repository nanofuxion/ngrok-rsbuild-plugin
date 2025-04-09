# ngrok-rsbuild-plugin

> 🌐 Expose your rsbuild dev server over the internet via ngrok — built for use with the **LynxJS Native App Framework**.

This plugin creates an [ngrok](https://ngrok.com/) tunnel for your dev server, sets the correct `assetPrefix` for remote access, and optionally integrates with [`@lynx-js/qrcode-rsbuild-plugin`](https://www.npmjs.com/package/@lynx-js/qrcode-rsbuild-plugin) to generate a QR code for fast mobile testing.

---

> ⚠️ **Disclaimer:** This README and plugin were generated and written with the help of AI. It may contain inaccuracies.  
> I'm not affiliated with LynxJS or its maintainers — this was built independently for use with the LynxJS ecosystem.  
>  
> 🛠️ **Pull requests are welcome!** If you notice something broken or unclear, feel free to contribute!

---

## Features

- 🔓 Automatically exposes your dev server using `ngrok`
- 🛠 Injects `assetPrefix` into `dev` config for remote asset loading
- 📱 (Optional) Displays a QR code with your public ngrok URL for mobile devices
- 📄 Logs activity to `logs.txt` for debugging

---

## Installation

```bash
npm install ngrok ngrok-rsbuild-plugin @lynx-js/qrcode-rsbuild-plugin --save-dev
```

---

## Setup

### Step 1: Add `NGROK_TOKEN` to your `.env`

```env
NGROK_TOKEN=your-ngrok-authtoken
```

### Step 2: Use the plugin in your rsbuild config

```ts
// rsbuild.config.ts or index.ts
import { pluginNgrok, setServer } from './ngrok-rsbuild-plugin'

export default {
  plugins: [pluginNgrok()],
  async setup() {
    const config = await setServer({
      host: 'localhost',
      port: 3000,
    });

    return config;
  }
}
```

---

## API

### `setServer({ host, port })`

Returns modified `server` and `dev` config with an updated `assetPrefix`.

### `pluginNgrok(options?)`

Initializes the plugin and exposes the ngrok URL via the rsbuild API. Optionally accepts:

```ts
{
  schema?: (url: string) => any // defaults to { http: url }
}
```

---

## Notes

- You must have a valid `NGROK_TOKEN` set in your `.env` file.
- The plugin writes logs to `logs.txt` in the project root.
- The `ngrok` URL is exposed via `api.expose('lynx:rsbuild:ngrok', { ngrok_url })`.

---

## License

MIT