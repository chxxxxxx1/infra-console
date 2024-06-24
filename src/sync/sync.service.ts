import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as fse from 'fs-extra';
import * as glob from 'glob';
import * as path from 'path';
import { LocalStorageService } from '../localStorage/localStorage.service';

@Injectable()
export class SyncService implements OnApplicationBootstrap {
  @Inject(LocalStorageService)
  private readonly localStorageService: LocalStorageService;
  onApplicationBootstrap() {
    const installWebPath = path.resolve('./install-web');
    fse.ensureDirSync(installWebPath);
    this.initResource(installWebPath);
  }

  async initResource(installWebPath: string) {
    const list = glob.sync('**/*', { cwd: './install-web', nodir: true });
    await Promise.all(
      list.map((item) => {
        const fct = fse.readFileSync(path.join(installWebPath, item));
        return this.localStorageService.putObjet(item, fct);
      }),
    );
  }
}
