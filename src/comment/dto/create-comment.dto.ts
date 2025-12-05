import { IsNotEmpty, IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsMongoId()
  post: string;

  @IsOptional()
  @IsString()
  parentComment?: string;
}
