# Launcher

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/MinecraftJS/launcher/Build?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/MinecraftJS/launcher?style=for-the-badge)
![npm (scoped)](https://img.shields.io/npm/v/@minecraft-js/launcher?style=for-the-badge)

This library makes creating Minecraft launchers in JavaScript very easy. It'll help you managing all the stuff Minecraft requires like downloading the game and the assets.

# Documentation

## Installation

Install the package:

```bash
$ npm install @minecraft-js/launcher
```

And then import it in your JavaScript/TypeScript file

```ts
const { mcFolder } = require('@minecraft-js/launcher'); // CommonJS

import { mcFolder } from '@minecraft-js/launcher'; // ES6
```

## Downloading assets

```ts
await mcFolder.downloadAssets('1.16.5'); // You can put any version here
```
