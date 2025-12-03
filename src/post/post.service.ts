import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(userId: string, createPostDto: CreatePostDto): Promise<Post> {
    const post = await this.postModel.create({
      ...createPostDto,
      author: userId,
    });

    return (await post.populate('author', 'username email')) as Post;
  }

  async findAll(query?: {
    status?: string;
    author?: string;
    tag?: string;
  }): Promise<Post[]> {
    const filter: any = {};

    if (query?.status) {
      filter.status = query.status;
    }
    if (query?.author) {
      filter.author = query.author;
    }
    if (query?.tag) {
      filter.tags = query.tag;
    }

    return this.postModel
      .find(filter)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel
      .findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true },
      )
      .populate('author', 'username email')
      .exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(
    id: string,
    userId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.postModel.findById(id).exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.toString() !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .populate('author', 'username email')
      .exec();

    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }

    return updatedPost;
  }

  async delete(id: string, userId: string): Promise<{ message: string }> {
    const post = await this.postModel.findById(id).exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postModel.findByIdAndDelete(id).exec();

    return { message: 'Post deleted successfully' };
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.postModel
      .find({ author: authorId })
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }
}