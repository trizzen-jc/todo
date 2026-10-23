import { Schema, models, model } from "mongoose";

const WeeklyGoalSchema = new Schema(
  {
    text: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  { _id: false }
);

const WeeklyPlanSchema = new Schema(
  {
    weekStart: { type: Date, required: true, unique: true },
    goals: { type: [WeeklyGoalSchema], default: [] },
    memo: { type: String, default: "" },
    retrospective: { type: String, default: "" },
    goalId: { type: Schema.Types.ObjectId, ref: "Goal" },
  },
  { timestamps: true }
);

export default models.WeeklyPlan || model("WeeklyPlan", WeeklyPlanSchema);
