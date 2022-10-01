import { join } from 'node:path';

/** Path to the `.minecraft` folder */
export const DOT_MINECRAFT =
  process.platform === 'win32'
    ? join(process.env.APPDATA, '.minecraft')
    : process.platform === 'darwin'
    ? join(process.env.HOME, 'Library', 'Application Support', 'minecraft')
    : join(process.env.HOME, '.minecraft');

/** URL pointing to the version manifest */
export const VERSION_MANIFEST_URL =
  'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json';

export function OBJECT_FOLDER(hash: string): string {
  return join(DOT_MINECRAFT, 'assets', 'objects', hash.slice(0, 2));
}

export function OBJECT_PATH(hash: string): string {
  return join(OBJECT_FOLDER(hash), hash);
}

export function ASSET_DOWNLOAD_URL(hash: string): string {
  return `http://resources.download.minecraft.net/${hash.slice(0, 2)}/${hash}`;
}

export function ASSET_INDEX_PATH(id: string): string {
  return join(DOT_MINECRAFT, 'assets', 'indexes', `${id}.json`);
}
