import { Schema, model, Document, Query } from "mongoose";

export interface DeviceQueryOptions extends Partial<
  Record<FilterField, string>
> {
  sort?: string;
  sortBy?: string;
  page?: string;
  limit?: string;
  all?: string;

  manufacturer?: string;
  type?: string;
  condition?: string;
  status?: string;
}

const ALLOWED_SORT_FIELDS = ["cost_price", "name", "createdAt", "quantity"];
const ALLOWED_FILTER_FIELDS = ["manufacturer", "type", "condition", "status"];
type FilterField = (typeof ALLOWED_FILTER_FIELDS)[number];
export const applyQueryOptions = <T extends Document>(
  query: Query<T[], T>,
  options: DeviceQueryOptions,
) => {
  const { sort, sortBy, page = "1", limit = "10", all = "true" } = options;

  // apply each filter field independently if present
  for (const field of ALLOWED_FILTER_FIELDS) {
    const value = options[field];

    if (value) {
      query = query.where(field).equals(value);
    }
  }

  // sort
  if (sortBy && ALLOWED_SORT_FIELDS.includes(sortBy)) {
    const sortOrder = sort === "desc" ? -1 : 1;
    query = query.sort({ [sortBy]: sortOrder });
  }

  if (all !== "true") {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));
  }

  return query;
};

const deviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["mobile", "gadget", "audio", "other"],
      default: "mobile",
    },
    quantity: {
      type: Number,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    cost_price: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      enum: ["new", "used", "refurbished"],
      default: "new",
    },
    status: {
      type: String,
      enum: ["available", "sold", "damaged", "out_of_stock", "returned"],
      default: "available",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        const { _id, __v, ...rest } = ret;
        return { id: _id, ...rest };
      },
    },
    // toObject: {
    //   virtuals: true,
    //   transform: (doc, ret) => {
    //     delete (ret as any).__v;
    //     delete (ret as any)._id;
    //   },
    // },
  },
);
// deviceSchema.virtual("profit").get(function () {
//   return this.selling_price - this.cost_price;
// });

export const Device = model("Device", deviceSchema);
