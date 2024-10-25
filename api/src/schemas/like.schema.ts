import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Like extends Document {
  @Prop()
  user: string;

  @Prop()
  article: string;
}

export const likeSchema = SchemaFactory.createForClass(Like);
