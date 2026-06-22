import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('catalog')
@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('assets')
  list(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.catalog.listPublished(
      limit ? Number(limit) : 24,
      offset ? Number(offset) : 0,
    );
  }

  @Get('creators/:handle/assets/:slug')
  get(@Param('handle') handle: string, @Param('slug') slug: string) {
    return this.catalog.getByCreatorSlug(handle, slug);
  }
}
