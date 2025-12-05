import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import { Model, Types } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.commentModel.create({
      content: createCommentDto.content,
      post: new Types.ObjectId(createCommentDto.post),
      author: new Types.ObjectId(userId),
      ...(createCommentDto.parentComment && {
        parentComment: new Types.ObjectId(createCommentDto.parentComment),
      }),
    });

    return (await comment.populate([
      { path: 'author', select: 'username email' },
      { path: 'post', select: 'title content excerpt' },
    ])) as Comment;
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ post: new Types.ObjectId(postId), parentComment: null })
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findReplies(commentId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ parentComment: new Types.ObjectId(commentId) })
      .populate('author', 'username email')
      .sort({ createdAt: 1 })
      .exec();
  }

  async update(
    id: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.toString() !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .populate('author', 'username email')
      .exec();

    if (!updatedComment) {
      throw new NotFoundException('Comment not found after update');
    }

    return updatedComment;
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
  const comment = await this.commentModel.findById(id).exec();

  if (!comment) {
    throw new NotFoundException('Comment not found');
  }

  if (comment.author.toString() !== userId) {
    throw new ForbiddenException('You can only delete your own comments');
  }

  // Convert string id to ObjectId for the query
  await this.commentModel
    .deleteMany({
      $or: [
        { _id: new Types.ObjectId(id) },
        { parentComment: new Types.ObjectId(id) },
      ],
    })
    .exec();

  return { message: 'Comment deleted successfully' };
}
}