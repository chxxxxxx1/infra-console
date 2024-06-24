import { Inject, Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
import * as path from 'path';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class LocalStorageService {
  private readonly logger = new Logger(LocalStorageService.name);

  @Inject(UtilsService)
  private readonly utilsService: UtilsService;
  async putObjet(filePath: string, buff: Buffer) {
    const target = process.env.WEBROOT || '/webroot';
    const targetPaths = path.join(process.cwd(), target, filePath);
    const [err] = await to<void>(
      this.utilsService.writeFileSync(targetPaths, buff, 'utf8'),
    );
    if (err) {
      this.logger.error(err);
    } else {
      this.logger.log(targetPaths);
    }
  }
}
