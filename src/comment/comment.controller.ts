import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';
import { JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorators';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser('_id') userId: string,
  ) {
    return this.commentService.create(createCommentDto, userId);
  }

  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
      return this.commentService.findByPost(postId);
  }

  // GET /comment/:id/replies - Get replies to a comment (Public)
  @Get(':id/replies')
  findReplies(@Param('id') id: string) {
      return this.commentService.findReplies(id);
  }

  // PATCH /comment/:id - Update comment (Protected)
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('_id') userId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, userId, updateCommentDto);
  }

  // DELETE /comment/:id - Delete comment (Protected)
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('_id') userId: string) {
      return this.commentService.delete(id, userId);
  }
}
