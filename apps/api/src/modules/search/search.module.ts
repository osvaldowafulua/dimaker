import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchBootstrap } from './search.bootstrap';

@Module({
  controllers: [SearchController],
  providers: [SearchService, SearchBootstrap],
  exports: [SearchService],
})
export class SearchModule {}
