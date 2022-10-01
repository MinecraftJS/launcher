import { VERSION_MANIFEST_URL } from '../constants';
import { request } from './request';

/** Caching the manifest for performance purposes */
let cachedManifest: VersionManifest;

/**
 * Fetch the version manifest from Mojang's API
 * @returns The fetched version manifest
 */
export async function getVersionManifest(
  options?: GetVersionManifestOptions
): Promise<VersionManifest> {
  options = options ?? {};

  if (cachedManifest && options.noCache !== true) return cachedManifest;

  const { body } = await request(VERSION_MANIFEST_URL);
  const manifest: VersionManifest = JSON.parse(body.toString());

  if (options.only)
    manifest.versions = manifest.versions.filter((ver) =>
      options.only.includes(ver.type)
    );

  manifest.versions = manifest.versions.map((ver) => ({
    ...ver,
    time: new Date(ver.time),
    releaseTime: new Date(ver.releaseTime),
    complianceLevel: Boolean(ver.complianceLevel),
  }));

  cachedManifest = manifest;

  return manifest;
}

export interface GetVersionManifestOptions {
  only?: ('release' | 'snapshot' | 'old_alpha')[];
  noCache?: boolean;
}

export interface VersionManifest {
  /** Object containing references to the latest versions */
  latest: {
    /** Current latest release */
    release: string;
    /** Current latest snapshot */
    snapshot: string;
  };
  /** Array with all Minecraft versions */
  versions: {
    /** Version id */
    id: string;
    /** Type of this version */
    type: 'release' | 'snapshot' | 'old_alpha';
    /** URL to the manifest file */
    url: string;
    time: Date;
    /** When the release was released */
    releaseTime: Date;
    /** SHA1 checksum of the manifest file */
    sha1: string;
    /** Whether the version supports player safety features */
    complianceLevel: boolean;
  }[];
}
