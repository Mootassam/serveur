import ApiResponseHandler from '../apiResponseHandler';
import phoneNumberService from '../../services/phoneNumber';
import socialService from '../../services/socialService';
import socialRepository from '../../database/repositories/socialRepository';

export default async (req, res, next) => {
  try {
    const payload = await socialRepository.create(
      req.body.social,
      req,
    );
    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
