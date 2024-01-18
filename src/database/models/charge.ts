import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import FileSchema from './schemas/fileSchema';

export default (database) => {
  try {
    return database.model('charge');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ChargeSchema = new Schema(
    {
      chargeType: {
        type: Schema.Types.ObjectId,
        ref: 'typeCharge',
        required: true,
      },
      amount: {
        type: Number,
      },
      date: {
        type: String,
      },
      depenses: {
        type: Schema.Types.ObjectId,
        ref: 'depense',
      },
      details: {
        type: String,
      },
      attachements: [FileSchema],
      tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: true,
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

  ChargeSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ChargeSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ChargeSchema.set('toJSON', {
    getters: true,
  });

  ChargeSchema.set('toObject', {
    getters: true,
  });

  return database.model('charge', ChargeSchema);
};
