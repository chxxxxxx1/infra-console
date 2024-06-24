import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetsModule } from './assets/assets.module';
import { LocalStorageService } from './localStorage/localStorage.service';
import { MasterModule } from './master/master.module';
import { SyncService } from './sync/sync.service';
import { UtilsService } from './utils/utils.service';

@Module({
  imports: [MasterModule, AssetsModule],
  controllers: [AppController],
  providers: [AppService, SyncService, LocalStorageService, UtilsService],
})
export class AppModule {}
