import { mkdir } from 'node:fs/promises';
import { DOT_MINECRAFT } from './constants';
import { downloadAssets } from './utils/downloadAssets';
import { exists } from './utils/exists';

export class MCFolder {
  public static readonly instance = new MCFolder();

  public constructor() {}

  /**
   * Initialize the `.minecraft` folder,
   * run all the checks
   */
  public async initialize(): Promise<void> {
    await this.checkFolderExistance();
  }

  /**
   * Download the Minecraft assets for the given version
   * @param version Version you want to download the assets for
   */
  public async downloadAssets(version: string): Promise<void> {
    await downloadAssets(version);
  }

  /**
   * Check if the `.minecraft` directory exists.
   * If it doesn't, it'll create it
   */
  private async checkFolderExistance(): Promise<void> {
    if (await exists(DOT_MINECRAFT)) return;

    await mkdir(DOT_MINECRAFT, { recursive: true });
  }
}

MCFolder.instance.initialize();

/** Static instance of the `MCFolder` class */
export const mcFolder = MCFolder.instance;
