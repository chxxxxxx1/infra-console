import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ApplicationService } from './application.service';

@Controller('deploy/application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}
  @Get()
  getApplication() {
    return this.applicationService.getDeploy();
  }
  @Delete(':id')
  uninstallApplication(@Param('id') id: string) {
    return this.applicationService.uninstall(id);
  }
  @Post('install')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.resolve(process.cwd(), 'fe-store'),
        filename: (req, file, callback) => {
          // 自定义文件名
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname); // 获取文件扩展名
          const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  install(@UploadedFile() file: Express.Multer.File) {
    return this.applicationService.install(file);
  }
}
