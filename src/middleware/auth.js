import { asyncHandler } from '@sliit-foss/functions';
import { default as createError } from 'http-errors';
import { isBlacklistedToken } from '@/repository/token';
import { getOneUser } from '@/repository/user';
import { decodeJwtToken } from '@/utils';

export const protect = asyncHandler(async (req) => {
  if (req.headers['x-api-key'] === process.env.API_ACCESS_KEY) return;
  const token = req.headers.authorization
    ? req.headers.authorization.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]?.replace('null', '')?.replace('undefined', '')
      : null
    : null;
  if (!token) throw new createError(401, 'Unauthorized');
  const isBackListedToken = isBlacklistedToken(token);
  if (isBackListedToken) throw new createError(401, 'Unauthorized');
  const decodedUser = decodeJwtToken(token).data;
  const user = decodedUser ? await getOneUser({ _id: decodedUser._id }, false) : null;
  if (!user) throw new createError(401, 'Unauthorized');
  req.user_token = token;
  req.user = user;
});

export const adminProtect = asyncHandler((req) => {
  if (req.headers['x-api-key'] === process.env.API_ACCESS_KEY) return;
  if (req.user.role !== 'ADMIN') throw new createError(403, 'You are not permitted to access this resource');
});
