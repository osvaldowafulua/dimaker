import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async query(
    @Query('q') q = '',
    @Query('type') type?: string,
    @Query('license') license?: string,
  ) {
    if (!q.trim()) return { hits: [], query: q };
    return this.searchService.search(q, { type, license });
  }
}
