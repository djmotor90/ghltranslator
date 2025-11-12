import mongoose, { Document, Schema } from 'mongoose';

export interface ITranslation extends Document {
  integrationId: mongoose.Types.ObjectId;
  key: string;
  english: string;
  russian: string;
  category: string;
  approved: boolean;
  source: 'system' | 'user' | 'crowdsourced';
  votes?: number;
  lastUpdatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const translationSchema = new Schema<ITranslation>(
  {
    integrationId: {
      type: Schema.Types.ObjectId,
      ref: 'Integration',
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    english: {
      type: String,
      required: true,
    },
    russian: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['ui', 'email', 'report', 'notification', 'other'],
    },
    approved: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: ['system', 'user', 'crowdsourced'],
      default: 'system',
    },
    votes: {
      type: Number,
      default: 0,
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

translationSchema.index({ integrationId: 1, key: 1 }, { unique: true });

export const Translation = mongoose.model<ITranslation>('Translation', translationSchema);
