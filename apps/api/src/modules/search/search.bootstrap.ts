import { Injectable, OnModuleInit } from '@nestjs/common';
import { SearchService } from './search.service';

@Injectable()
export class SearchBootstrap implements OnModuleInit {
  constructor(private readonly search: SearchService) {}

  async onModuleInit() {
    await this.search.ensureIndex();
  }
}
