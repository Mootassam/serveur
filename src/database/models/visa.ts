import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('social');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const VisaSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      multiple: {
        type: String,
      },
      Price: {
        type: String,
      },
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

  VisaSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  VisaSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  VisaSchema.set('toJSON', {
    getters: true,
  });

  VisaSchema.set('toObject', {
    getters: true,
  });

  return database.model('visa', VisaSchema);
};
