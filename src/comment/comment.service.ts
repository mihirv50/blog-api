import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/auth/decorators';

@Injectable()
export class CommentService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>){}

    async create(createCommentDto: CreateCommentDto, userId: string){
        try {
            const comment = await this.commentModel.create({
                ...createCommentDto,
                author: userId,
            })
            return comment.populate([
                { path: 'author', select: 'username email' },
                { path: 'post', select: 'title content excerpt' }
            ])
        } catch (error) {
            console.log(error)
        }
    }

    update(){
        return "Update a Comment"
    }
}
