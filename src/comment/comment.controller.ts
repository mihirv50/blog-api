import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';
import { JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorators';

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService){}
    @UseGuards(JwtGuard)
    @Post()
    create(@Body() createCommentDto: CreateCommentDto, @GetUser('_id') userId: string){
        return this.commentService.create(createCommentDto , userId);
    }

    @Put('update')
    update(@Body() updateCommentDto: UpdateCommentDto){}

    reply(){}

    @Delete('delete')
    delete(){}
}
