import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('PhoneNumber');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PhoneNumberSchema = new Schema(
    {
      number: {
        type: String,
        required: true,
      },
      tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
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

  PhoneNumberSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  PhoneNumberSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PhoneNumberSchema.set('toJSON', {
    getters: true,
  });

  PhoneNumberSchema.set('toObject', {
    getters: true,
  });

  return database.model('PhoneNumber', PhoneNumberSchema);
};
