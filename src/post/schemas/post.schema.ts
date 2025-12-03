import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  excerpt?: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;
  @Prop({ type: [String], default: [] })
  tags: string[];
  @Prop({ default: 'draft', enum: ['draft', 'published'] })
  status: string;

  @Prop({ default: 0 })
  views: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
