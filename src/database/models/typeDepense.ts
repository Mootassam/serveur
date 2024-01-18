import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('typeDepense');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const TypeDepenseSchema = new Schema(
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

  TypeDepenseSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  TypeDepenseSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  TypeDepenseSchema.set('toJSON', {
    getters: true,
  });

  TypeDepenseSchema.set('toObject', {
    getters: true,
  });

  return database.model('typeDepense', TypeDepenseSchema);
};
