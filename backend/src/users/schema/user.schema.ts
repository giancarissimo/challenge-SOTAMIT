import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  declare _id: string; // El tipado de typescript no reconoce por default el "_id" entonces hay que declararlo para poder acceder a los ids de los usuarios en mongo.

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, unique: true })
  dni: number;

  @Prop({ required: true, type: Date })
  birthdate: Date;

  @Prop({ required: true })
  is_developer: boolean;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  work_area: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: string;
};

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);