import { Schema, models, model } from "mongoose";

const GoalSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Goal || model("Goal", GoalSchema);
