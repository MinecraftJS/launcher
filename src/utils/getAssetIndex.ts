import { createHash } from 'node:crypto';
import { getVersion } from './getVersion';
import { request } from './request';

/**
 * Get the asset index of the given version
 * @param id Version of the asset index to get
 * @returns The asset index
 */
export async function getAssetIndex(
  id: string
): Promise<{ id: string; index: AssetIndex }> {
  const manifest = await getVersion(id);

  if (!manifest) throw new Error(`Version ${id} not found`);

  const { body } = await request(manifest.assetIndex.url);

  const bodyHash = createHash('sha1').update(body).digest('hex');
  if (bodyHash !== manifest.assetIndex.sha1)
    throw new Error('Invalid SHA1 checksum');

  if (body.length !== manifest.assetIndex.size)
    throw new Error('Invalid body size');

  return {
    id: manifest.assets,
    index: JSON.parse(body.toString()),
  };
}

export interface AssetIndex {
  objects: {
    [key: string]: {
      hash: string;
      size: number;
    };
  };
}
