import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('typeRevenue');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const TypeRevenueSchema = new Schema(
    {
      nom: {
        type: String,
        required: true,
      },
      tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: true
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      importHash: { type: String },
    },
    { timestamps: true },
  );

  TypeRevenueSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  TypeRevenueSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  TypeRevenueSchema.set('toJSON', {
    getters: true,
  });

  TypeRevenueSchema.set('toObject', {
    getters: true,
  });

  return database.model('typeRevenue', TypeRevenueSchema);
};
