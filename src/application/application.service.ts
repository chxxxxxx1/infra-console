import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as childProcess from 'child_process';
import * as crypto from 'crypto';
import * as fse from 'fs-extra';
import * as glob from 'glob';
import * as path from 'path';
import { ApplicationVo } from './vo/application.vo';

@Injectable()
export class ApplicationService {
  private readonly fedir: string;
  constructor() {
    this.fedir = path.resolve(process.cwd(), 'webroot');
  }
  getDeploy(): ApplicationVo[] {
    const list = glob.sync('**/*', {
      cwd: this.fedir,
      nodir: true,
    });
    let fileRecord: {
      [key: string]: ApplicationVo;
    } = {};
    list.forEach((item) => {
      const [type, name, version, ...files] = item.split('/');
      const key = [type, name, version].join('/');
      const current = fileRecord[key];
      const file = files.join('/');
      if (current) {
        if (!current.files.includes(file)) {
          current.files.push(file);
        }
      } else {
        const vo = new ApplicationVo();
        vo.files = [file];
        vo.name = name;
        vo.type = type.toUpperCase();
        vo.version = version;
        vo.id = crypto.createHash('sha256').update(key).digest('hex');
        fileRecord[key] = vo;
      }
    });
    return Object.values(fileRecord);
  }

  uninstall(id: string) {
    const files = this.getDeploy();
    const current = files.find((item) => item.id === id);
    const appdir = path.resolve(
      path.resolve(process.cwd(), 'webroot'),
      current.type.toLowerCase(),
      current.name,
    );
    if (current) {
      const removeTarget = path.resolve(appdir, current.version);
      const isDirectory = fse.statSync(removeTarget).isDirectory();
      if (isDirectory) {
        const versions = fse
          .readdirSync(appdir)
          .filter((item) => item !== current.version);
        if (versions.length) {
          fse.removeSync(removeTarget);
        } else {
          fse.removeSync(path.resolve(removeTarget, '..'));
        }
        return true;
      } else {
        throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new HttpException('没有找到该应用', HttpStatus.NOT_FOUND);
    }
  }

  install(file: Express.Multer.File) {
    try {
      childProcess.execSync(
        `unzip -o ${file.path} -d ${this.fedir} && rm -rf ${file.path}`,
      );
      return true;
    } catch (err) {
      throw new HttpException('更新失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
