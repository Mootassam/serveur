import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
import TenantUserSchema from './schemas/tenantUserSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('user');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const UserSchema = new Schema(
    {
      passportNumber: {
        type: String,
      },
      passportPhoto: [FileSchema],
      passportDocument: [FileSchema],
      nationality: {
        type: String,
      },
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      payee: {
        type: Boolean,
        default: false,
      },
      bearthday: {
        type: Date,
      },
      visastart: {
        type: Date,
      },
      visaend: {
        type: Date,
      },
      couponId: {
        type: Schema.Types.ObjectId,
        ref: 'Coupons',
      },
      visaDocument: {
        type: String,
      },
      fullName: { type: String, maxlength: 255 },
      firstName: { type: String, maxlength: 80 },
      lastName: { type: String, maxlength: 175 },
      phoneNumber: { type: String, maxlength: 24 },
      email: {
        type: String,
        maxlength: 255,
        index: { unique: true },
      },
      password: {
        type: String,
        maxlength: 255,
        select: false,
      },
      emailVerified: { type: Boolean, default: false },
      emailVerificationToken: {
        type: String,
        maxlength: 255,
        select: false,
      },
      emailVerificationTokenExpiresAt: { type: Date },
      passwordResetToken: {
        type: String,
        maxlength: 255,
        select: false,
      },
      passwordResetTokenExpiresAt: { type: Date },
      avatars: [FileSchema],
      tenants: [TenantUserSchema],
      jwtTokenInvalidBefore: { type: Date },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      importHash: { type: String, maxlength: 255 },
    },
    {
      timestamps: true,
    },
  );

  UserSchema.index(
    { importHash: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  UserSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  UserSchema.set('toJSON', {
    getters: true,
  });

  UserSchema.set('toObject', {
    getters: true,
  });

  return database.model('user', UserSchema);
};
