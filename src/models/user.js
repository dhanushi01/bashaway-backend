import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    verification_code: {
      type: String
    },
    is_verified: {
      type: Boolean,
      default: false
    },
    is_active: {
      type: Boolean,
      default: true
    },
    photo_url: {
      type: String
    },
    university: {
      type: String
    },
    role: {
      type: String,
      enum: ['ADMIN', 'GROUP'],
      default: 'GROUP'
    },
    members: {
      type: [
        {
          _id: false,
          name: {
            type: String,
            required: true
          },
          email: {
            type: String,
            required: true
          },
          phone: {
            type: String,
            required: true
          },
          academic_year: {
            type: Number,
            required: true,
            min: [1, 'Academic year should be from 1 to 4'],
            max: [4, 'Academic year should be from 1 to 4']
          }
        }
      ]
    }
  },
  {
    versionKey: '__v',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

UserSchema.plugin(aggregatePaginate);

UserSchema.index({ createdAt: 1 });

const User = mongoose.model('User', UserSchema);

User.syncIndexes();

export default User;
