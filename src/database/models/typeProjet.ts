import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('typeProjet');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const TypeProjetSchema = new Schema(
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

  TypeProjetSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  TypeProjetSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  TypeProjetSchema.set('toJSON', {
    getters: true,
  });

  TypeProjetSchema.set('toObject', {
    getters: true,
  });

  return database.model('typeProjet', TypeProjetSchema);
};
