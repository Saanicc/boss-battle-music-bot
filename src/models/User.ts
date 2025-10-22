import mongoose, { InferSchemaType, Document } from "mongoose";

const userSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  lastXP: {
    type: Date,
    default: null,
  },
  totalPlays: {
    type: Number,
    default: 0,
  },
  totalBossPlays: {
    type: Number,
    default: 0,
  },
});

userSchema.index({ guildId: 1, userId: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);

export type UserType = InferSchemaType<typeof userSchema>;
