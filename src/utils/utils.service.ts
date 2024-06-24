import { Injectable } from '@nestjs/common';
import * as fse from 'fs-extra';
import * as fs from 'node:fs';

@Injectable()
export class UtilsService {
  writeFileSync<T = string>(
    file: string,
    data: string | NodeJS.ArrayBufferView,
    opt: fs.WriteFileOptions,
  ): Promise<T> {
    fse.ensureFileSync(file as string);
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, opt, (err) => {
        if (err) {
          reject(err as T);
        } else {
          resolve(file as T);
        }
      });
    });
  }
}
