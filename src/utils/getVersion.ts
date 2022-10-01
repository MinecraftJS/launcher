import { createHash } from 'node:crypto';
import { getVersionManifest } from './getVersionManifest';
import { request } from './request';

/**
 * Fetch the verison manifest of the given version
 * @param id Version you want to fetch the manifest for
 * @returns The version manifest
 */
export async function getVersion(id: string): Promise<Version> {
  const manifest = await getVersionManifest();
  const version = manifest.versions.find((ver) => ver.id === id);

  if (!version) throw new Error(`Version ${id} not found`);

  const { body } = await request(version.url);

  const bodyHash = createHash('sha1').update(body).digest('hex');
  if (bodyHash !== version.sha1) throw new Error('Invalid SHA1 checksum');

  return JSON.parse(body.toString());
}

interface Rule {
  rules: {
    action: 'allow';
    features?: {
      [key: string]: boolean;
    };
    os?: {
      name: 'windows' | 'linux' | 'osx';
      version?: string;
      arch?: string;
    };
  }[];
  value: string | string[];
}

interface VersionDownload {
  sha1: string;
  size: number;
  url: string;
}

export interface Version {
  arguments: {
    game: (string | Rule)[];
    jvm: (string | Rule)[];
  };
  assetIndex: {
    id: string;
    sha1: string;
    size: number;
    totalSize: number;
    url: string;
  };
  assets: string;
  complianceLevel: number;
  downloads: {
    client: VersionDownload;
    client_mappings: VersionDownload;
    server: VersionDownload;
    server_mappings: VersionDownload;
  };
  id: string;
  javaVersion: {
    component: 'java-runtime-gamma' | 'jre-legacy';
    majorVersion: number;
  };
  libraries: {
    downloads: {
      artifact: {
        path: string;
        sha1: string;
        size: number;
        url: string;
      };
    };
    name: string;
    rules?: Rule[];
  }[];
  loggin: {
    client: {
      argument: string;
      file: {
        id: string;
        sha1: string;
        size: number;
        url: string;
      };
      type: string;
    };
  };
  mainClass: string;
  minimumLauncherVersion: number;
  releaseTime: string;
  time: string;
  type: 'release' | 'snapshot' | 'old_alpha';
}
