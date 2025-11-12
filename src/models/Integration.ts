import mongoose, { Document, Schema } from 'mongoose';

export interface IIntegration extends Document {
  userId: mongoose.Types.ObjectId;
  accountId: string;
  accountName: string;
  ghlAccountId: string;
  status: 'active' | 'inactive' | 'error';
  translationEnabled: boolean;
  preferredLanguage: 'en' | 'ru';
  webhookUrl?: string;
  webhookSecret?: string;
  lastSyncedAt?: Date;
  errorMessage?: string;
  settings?: {
    translateDashboard?: boolean;
    translateEmails?: boolean;
    translateReports?: boolean;
    customTranslations?: Record<string, string>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const integrationSchema = new Schema<IIntegration>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    ghlAccountId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'error'],
      default: 'active',
    },
    translationEnabled: {
      type: Boolean,
      default: true,
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'ru'],
      default: 'ru',
    },
    webhookUrl: String,
    webhookSecret: String,
    lastSyncedAt: Date,
    errorMessage: String,
    settings: {
      translateDashboard: { type: Boolean, default: true },
      translateEmails: { type: Boolean, default: false },
      translateReports: { type: Boolean, default: true },
      customTranslations: { type: Schema.Types.Mixed, default: {} },
    },
  },
  {
    timestamps: true,
  }
);

export const Integration = mongoose.model<IIntegration>('Integration', integrationSchema);
