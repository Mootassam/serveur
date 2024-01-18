import AuthService from '../../services/auth/authService';
import phoneNumberService from '../../services/phoneNumber';
import apiResponseHandler from '../apiResponseHandler';

export default async (req, res, next) => {
  try {
    const payload = await phoneNumberService.uploadNumber(
      req,
      req,
    );
    await apiResponseHandler.success(req, res, payload);
  } catch (error) {
    await apiResponseHandler.error(req, res, error);
  }
};
