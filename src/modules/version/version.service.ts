import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class VersionService {
  private compareVersions(a: string, b: string): number {
    const pa = a.split('.').map((x) => parseInt(x, 10) || 0);
    const pb = b.split('.').map((x) => parseInt(x, 10) || 0);
    const n = Math.max(pa.length, pb.length);
    for (let i = 0; i < n; i++) {
      const na = pa[i] || 0;
      const nb = pb[i] || 0;
      if (na > nb) return 1;
      if (na < nb) return -1;
    }
    return 0;
  }

  private extractVersion(html: string): string | null {
    const regex = /Version[\s\S]{0,30}?(\d+(?:\.\d+){0,})/i;
    const match = html.match(regex);
    return match ? match[1].trim() : null;
  }

  private async getPlayVersion(packageName: string): Promise<string | null> {
    const url = `https://play.google.com/store/apps/details?id=${packageName}&hl=en&gl=US`;
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)' },
    });
    return this.extractVersion(data);
  }

  async checkUpdate(packageName: string, localVersion?: string) {
    const remoteVersion = await this.getPlayVersion(packageName);

    if (!remoteVersion) {
      return { message: 'Versiya topilmadi' };
    }

    const result: any = {
      package: packageName,
      remoteVersion,
      localVersion: localVersion || null,
      updateAvailable: false,
    };

    if (localVersion) {
      result.updateAvailable =
        this.compareVersions(remoteVersion, localVersion) === 1;
    }

    return result;
  }
}
