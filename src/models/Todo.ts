import { Schema, models, model } from "mongoose";

const TodoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["todo", "doing", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    dueDate: { type: Date },
    dayOfWeek: { type: Number, min: 0, max: 6 },
    order: { type: String, required: true },
    weeklyPlanId: { type: Schema.Types.ObjectId, ref: "WeeklyPlan" },
    goalId: { type: Schema.Types.ObjectId, ref: "Goal" },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

TodoSchema.index({ status: 1, order: 1 });

export default models.Todo || model("Todo", TodoSchema);
