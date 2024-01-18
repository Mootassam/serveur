import PhoneNumberRepositopry from '../database/repositories/PhoneNumberRepository';
import Error400 from '../errors/Error400';
import Error402 from '../errors/Error402';

class socialService {
  static async create(number, options) {
    try {
      const data =
        await PhoneNumberRepositopry.Finduplicate(
          number,
          options,
        );
      if (data) {
        throw new Error402('Number alreday exist');
      }
      const payload =
        await PhoneNumberRepositopry.saveNumber(
          number,
          options,
        );
      return payload;
    } catch (error) {
      throw error;
    }
  }
}

export default socialService;
