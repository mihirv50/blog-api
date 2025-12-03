import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: require('./schemas/post.schema').PostSchema }])],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
