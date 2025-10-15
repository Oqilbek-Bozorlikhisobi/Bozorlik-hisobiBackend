// sms.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
const FormData = require('form-data');

@Injectable()
export class SmsService {
  private myEmail: string | undefined;
  private myPassword: string | undefined;

  private tokenCache: { token: string; createdAt: Date } | null = null;

  constructor(private configService: ConfigService) {
    this.myEmail = this.configService.get<string>('ESKIZ_EMAIL');
    this.myPassword = this.configService.get<string>('ESKIZ_PASSWORD');
  }

  private async loginEskiz(): Promise<string> {
    const data = new FormData();
    data.append('email', this.myEmail);
    data.append('password', this.myPassword);

    const res = await axios.post(
      'https://notify.eskiz.uz/api/auth/login',
      data,
      { headers: data.getHeaders() },
    );

    const token = res.data.data.token;

    // cache ichiga saqlaymiz
    this.tokenCache = { token, createdAt: new Date() };

    return token;
  }

  private async getValidToken(): Promise<string> {
    if (this.tokenCache) {
      const ageHours =
        (Date.now() - this.tokenCache.createdAt.getTime()) / 1000 / 60 / 60;
      if (ageHours < 720) {
        return this.tokenCache.token;
      }
    }
    return this.loginEskiz();
  }

  async sendSms(phone_number: string, otp: string, template:string) {
    const token = await this.getValidToken();
    const message = `${template} ${otp}`;

    const data = new FormData();
    data.append('mobile_phone', phone_number.replace(/\D/g, ''));
    data.append('message', message);

    try {
      const res = await axios.post(
        'https://notify.eskiz.uz/api/message/sms/send',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...data.getHeaders(),
          },
        },
      );
      return res.data;
    } catch (err: any) {
      console.error('Eskiz error:', err.response?.data || err.message);
      throw err;
    }
  }
}
