import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available categories' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all lesson categories',
  })
  findAll() {
    return this.categoriesService.findAll();
  }
}


