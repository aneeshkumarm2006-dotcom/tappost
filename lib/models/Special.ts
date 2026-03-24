import mongoose, { Schema, Document, Model } from 'mongoose';

// ─── Special Document Interface ───

export interface ISpecial extends Document {
  barId: mongoose.Types.ObjectId;
  name: string;
  price?: string;
  timeWindow?: string;
  notes?: string;
  photoUrl?: string;
  activeDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Special Schema ───

const SpecialSchema = new Schema<ISpecial>(
  {
    barId: {
      type: Schema.Types.ObjectId,
      ref: 'Bar',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: String,
    timeWindow: String,
    notes: String,
    photoUrl: String,
    activeDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for querying today's specials per bar
SpecialSchema.index({ barId: 1, activeDate: 1 });

// ─── Export Model ───

const Special: Model<ISpecial> =
  mongoose.models.Special || mongoose.model<ISpecial>('Special', SpecialSchema);

export default Special;
