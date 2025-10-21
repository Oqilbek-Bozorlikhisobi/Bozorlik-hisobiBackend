import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);

  onModuleInit() {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    };

    try {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
      this.logger.log('Firebase initialized');
    } catch (error) {
      this.logger.error('Firebase initialization error', error);
      throw new BadRequestException('Firebase initialization error');
    }
  }

  async sendToToken(
    token: string,
    title: string,
    body: string,
    sound = 'default',
  ) {
    if (!token) return;
    const message: admin.messaging.Message = {
      token,
      notification: { title, body },
      android: { notification: { sound } },
      apns: { payload: { aps: { sound } } },
      data: { click_action: 'FLUTTER_NOTIFICATION_CLICK' },
    };
    return admin.messaging().send(message);
  }

  async sendToTokens(
    tokens: string[],
    title: string,
    body: string,
    sound = 'default',
  ) {
    if (!tokens || tokens.length === 0) return;

    const CHUNK = 500;
    const results: admin.messaging.BatchResponse[] = [];

    for (let i = 0; i < tokens.length; i += CHUNK) {
      const chunk = tokens.slice(i, i + CHUNK);
      const message: admin.messaging.MulticastMessage = {
        notification: { title, body },
        android: { notification: { sound } },
        apns: { payload: { aps: { sound } } },
        tokens: chunk,
      };

      const resp = await admin.messaging().sendEachForMulticast(message);
      results.push(resp);
    }

    return results;
  }
}
