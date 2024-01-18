import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('typeCharge');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const TypeChargeSchema = new Schema(
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

  TypeChargeSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  TypeChargeSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  TypeChargeSchema.set('toJSON', {
    getters: true,
  });

  TypeChargeSchema.set('toObject', {
    getters: true,
  });

  return database.model('typeCharge', TypeChargeSchema);
};
