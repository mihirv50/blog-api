import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtGuard } from '../auth/guards/index';
import { GetUser } from '../auth/decorators/index';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // POST 
  @UseGuards(JwtGuard)
  @Post()
  create(
    @GetUser('_id') userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(userId, createPostDto);
  }

  // GET 
  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('author') author?: string,
    @Query('tag') tag?: string,
  ) {
    return this.postService.findAll({ status, author, tag });
  }

  // GET 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  // PATCH 
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('_id') userId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, userId, updatePostDto);
  }

  // DELETE
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser('_id') userId: string,
  ) {
    return this.postService.delete(id, userId);
  }

  // GET 
  @Get('author/:authorId')
  findByAuthor(@Param('authorId') authorId: string) {
    return this.postService.findByAuthor(authorId);
  }
}