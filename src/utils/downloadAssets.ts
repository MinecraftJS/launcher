import { DownloaderHelper } from 'node-downloader-helper';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import {
  ASSET_DOWNLOAD_URL,
  ASSET_INDEX_PATH,
  OBJECT_FOLDER,
  OBJECT_PATH,
} from '../constants';
import { exists } from './exists';
import { getAssetIndex } from './getAssetIndex';

/**
 * Download the Minecraft assets for the given version
 * @param version Version you want to download the assets for
 * @param options Options you can pass to this function to modify its behavior
 */
export async function downloadAssets(
  version: string,
  options?: DownloadAssetsOptions
): Promise<void> {
  options = options ?? {};

  const { id, index } = await getAssetIndex(version);

  await writeFile(ASSET_INDEX_PATH(id), JSON.stringify(index));

  const toDownload: { hash: string; size: number }[] = [];

  for (const object of Object.values(index.objects)) {
    const path = OBJECT_PATH(object.hash);

    if (!(await exists(path))) {
      toDownload.push(object);
      continue;
    }

    if (
      options.disableSizeCheck !== true ||
      options.disableHashCheck !== true
    ) {
      const file = await readFile(path);

      if (options.disableSizeCheck !== true && file.length !== object.size) {
        toDownload.push(object);
        continue;
      }

      if (options.disableHashCheck !== true) {
        const hash = createHash('sha1').update(file).digest('hex');
        if (hash !== object.hash) toDownload.push(object);
      }
    }
  }

  for (const object of toDownload) {
    await downloadAsset(object.hash);
  }
}

/**
 * Download an asset from the given hash
 * @param hash Hash of the file you want to download
 */
function downloadAsset(hash: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const download = new DownloaderHelper(
      ASSET_DOWNLOAD_URL(hash),
      OBJECT_FOLDER(hash),
      {
        fileName: hash,
      }
    );

    download.on('error', reject);
    download.on('end', () => resolve());
    download.start();
  });
}

export interface DownloadAssetsOptions {
  /** Whether or not to disable the size check */
  disableSizeCheck?: boolean;
  /** Whether or not to disable the hash check */
  disableHashCheck?: boolean;
}
