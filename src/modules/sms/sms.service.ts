// sms.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
const FormData = require('form-data');

const TOKEN_FILE = path.join(process.cwd(), 'sms_token.json');

@Injectable()
export class SmsService {
  private myEmail: string | undefined;
  private myPassword: string | undefined;

  constructor(private configService: ConfigService) {
    this.myEmail = this.configService.get<string>('ESKIZ_EMAIL');
    this.myPassword = this.configService.get<string>('ESKIZ_PASSWORD');
  }

  private async loadTokenFromFile(): Promise<string | null> {
    try {
      if (fs.existsSync(TOKEN_FILE)) {
        const data = fs.readFileSync(TOKEN_FILE, 'utf8');
        const { token, createdAt } = JSON.parse(data);
        const ageHours =
          (Date.now() - new Date(createdAt).getTime()) / 1000 / 60 / 60;
        if (ageHours < 720) {
          return token;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  private async saveTokenToFile(token: string) {
    fs.writeFileSync(
      TOKEN_FILE,
      JSON.stringify({ token, createdAt: new Date().toISOString() }, null, 2),
    );
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
    await this.saveTokenToFile(token);
    return token;
  }

  private async getValidToken(): Promise<string> {
    let token = await this.loadTokenFromFile();
    if (!token) {
      token = await this.loginEskiz();
    }
    return token;
  }

  async sendSms(phone_number: string, otp: string) {
    const token = await this.getValidToken();

    const data = new FormData();
    data.append('mobile_phone', phone_number.replace(/\D/g, ''));
    // data.append('message', `${otp}`);
    data.append('message', `This is test from Eskiz`);
    // data.append('from', '4546');

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
      console.error('SMS yuborishda xato:', err.response?.data || err.message);
      throw err;
    }
  }
}
