import PhoneNumberRepositopry from '../database/repositories/PhoneNumberRepository';
import Error400 from '../errors/Error400';
import Error402 from '../errors/Error402';

class visaService {
  static async saveNumber(number, options) {
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

  static async checkNumber(number, options) {
    try {
      const data =
        await PhoneNumberRepositopry.Finduplicate(
          number,
          options,
        );
      if (data) {
        throw new Error402('Number alreday exist');
      }
      const payload = 'Number Not Exist ';
      return payload;
    } catch (error) {
      throw error;
    }
  }

  static async uploadNumber(req, options) {
    let number;
    try {
      const payload =
        await PhoneNumberRepositopry.uploadFile(req);
      if (payload) {
        number =
          await PhoneNumberRepositopry.checkDuplicate(
            payload,
            options,
          );
      }
      return number;
    } catch (error) {
      throw error;
    }
  }
}

export default visaService;
