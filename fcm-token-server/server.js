/**
 * FCM Token Server
 * Simple Node.js server to generate OAuth2 tokens for Firebase Cloud Messaging
 * Run this alongside your PocketBase server
 */

const http = require('http');
const https = require('https');

// Your Firebase Service Account credentials
const SERVICE_ACCOUNT = {
  type: 'service_account',
  project_id: 'zehna-notifications',
  private_key_id: '0a4ef7d392f39889c3ecefef657d2823a908e217',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCzI32DAnuBmmdk\nJNr8IKvK1wwun2kd86LKQrBZNp0Lkl7atv5rD7F0J8KHOXRCaNFtSPQhzUHHWX6F\nzbD06qgF9IRSHXaxONKSTDkRr67In49Tl8wcVqmPwM4ZcR7RJnxHERsnLwzuQwbb\npG3GR/AvZlQTe6q5JCn/N6Knu94trPFxfneH8jYYSOrhOtmQmVx9RQ9r/9einfJO\neiHrrkcD11gURXOrQbU4tqLGrBH5K5DT1Py1E8K2BLnpor4BSyqQMOxfjcu9Juxn\nmJXiPQc0G0bISBW0iNaCDyP79C6WLbJvgQ1E9NUpH5DdI9zNatnlgOGtKYepi3qf\n34LNCe5LAgMBAAECggEACJDmDmQ0Kgk18B96YJENYJ3c5W6A/8on2s/Kj/w2Zphs\nCb2zYm+LLEM/ID6P6ncJq1X65Tzj7CzsNGjBZqIWlnD6p386LupJLhllUeJak28H\nKFemDnrZu9fb4x06Jy/VxIOIZAdyG63qf4lC0zbwa3Z+Bw/O+kXE7lZ85Clty+BD\nHprTDj6E05nbKQU7WYicbTlvxpoDxUeSN5wiSyXZCA0SXPX5FfSc05zgCbbdD0XZ\nK1lF6ANOTPSRjhXsC6Mclw6tSrwuO0KDV5VvVz7RyPt9tEMbZzWAgOUDjcVxq311\nEFI7E5jyJjy31fkaVnOSLof4iid/TXR06n+ILXylNQKBgQDt7b00JGRCzUYj8P3j\nQjRFKlEFY5fTQsP4bpvukTGwcVH+CDovFCJJvVoML0MtA/jLSF2qxcbAXrmN62J7\nSBJCLaHoKrdqrI9dkxjfsyZg/JVODzGac9kGVVmLRDoaWWWQth7j4Hi7fJ3c0Isw\nRHm4A8CsSLMq4WoHv/ZBXTo8vQKBgQDAvqTLi53trITi8M4e4k9Pgyk4Ac5+LRFA\nq6dQPBmz1sOCssVu/ihGEEAz3OT1LPHtya1SrICt2mbWHJmzEYPvKj1MfqxI50BA\nTipvNWgCVmgO4YMZ0AgaCyywmiDcwyZiCBSXtsxd7Hrj0ltos4lgVqKsE5LSLEKj\nfzkGNev7pwKBgQDIXUrWXEcqkl+c6NeFyDzoeihc13AF8tXBorQiBZfItMWNnjQR\nbW0qmBD67douUIf1+O0YYRFs8thkEXOPyjPGE1OjhkWLyeG5taRezillx4+ceuMU\n5LZAxSNxSnV7twj3Aseks2Y4zUrLp7tvXFr8gfyBmX94fvehqyCgDvh6KQKBgQCj\nYnfLWySajn1u6nWvVGOqoSJVqaJi7s0LJvcDWo7nFYxRxDz8Y1G8YpYp4HvtIRZL\nXYQg6r2Bofs+UKwxUQ2ntQSVTWO5wN2EJT5vWrQ6FwjKZHt/bAsSGJrfcSeeO4bT\n3sml+XyvuYBKksyNqnMvSQFIIKd6pa4vbe7mxtqtTQKBgGmlhuO2gAzXy1aP/hsp\nr4lsHQwKgkq2HjUH9mNLWEql2wnDbOVjP8+YXpLijI6b/cMnUCjmRovJ0MGONWAW\npkuEnC8gO0xodu7aNbAp1lfqAfGGvuIkCCMWEmNLabo4IWh+gqRUhFh+5D7wqAhK\nmvbeFtUnN/1IDeO2mMcnC9QF\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-fbsvc@zehna-notifications.iam.gserviceaccount.com',
  client_id: '104441077114782832812',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40zehna-notifications.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

// Token cache
let cachedToken = null;
let tokenExpiry = 0;

/**
 * Generate JWT and get OAuth2 access token from Google
 */
function getAccessToken() {
  return new Promise((resolve, reject) => {
    // Check cache
    const now = Math.floor(Date.now() / 1000);
    if (cachedToken && now < tokenExpiry - 300) {
      console.log('✅ Using cached token');
      return resolve(cachedToken);
    }

    console.log('🔄 Generating new access token...');

    const crypto = require('crypto');

    // Create JWT
    const now_seconds = Math.floor(Date.now() / 1000);
    const exp = now_seconds + 3600;

    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const claimSet = {
      iss: SERVICE_ACCOUNT.client_email,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: 'https://oauth2.googleapis.com/token',
      exp: exp,
      iat: now_seconds,
    };

    // Base64url encode
    const base64url = (obj) => {
      return Buffer.from(JSON.stringify(obj))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    };

    const encodedHeader = base64url(header);
    const encodedClaim = base64url(claimSet);
    const signatureInput = `${encodedHeader}.${encodedClaim}`;

    // Sign with private key
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    sign.end();

    const signature = sign
      .sign(SERVICE_ACCOUNT.private_key, 'base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const jwt = `${signatureInput}.${signature}`;

    // Exchange JWT for access token
    const postData = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }).toString();

    const options = {
      hostname: 'oauth2.googleapis.com',
      port: 443,
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.access_token) {
            cachedToken = response.access_token;
            tokenExpiry = now_seconds + (response.expires_in || 3600);
            console.log('✅ Access token generated successfully');
            resolve(cachedToken);
          } else {
            console.error('❌ No access token in response:', data);
            reject(new Error('No access token received'));
          }
        } catch (error) {
          console.error('❌ Error parsing token response:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Send FCM notification
 */
function sendNotification(fcmToken, notification, accessToken) {
  return new Promise((resolve, reject) => {
    const message = {
      message: {
        token: fcmToken,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
          },
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      },
    };

    const postData = JSON.stringify(message);

    const options = {
      hostname: 'fcm.googleapis.com',
      port: 443,
      path: `/v1/projects/${SERVICE_ACCOUNT.project_id}/messages:send`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Length': postData.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Notification sent successfully');
          resolve({ success: true, response: data });
        } else {
          console.error(`❌ FCM error (${res.statusCode}):`, data);
          reject(new Error(`FCM returned ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * HTTP Server
 */
const PORT = 3001;

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // GET /token - Get access token
  if (req.url === '/token' && req.method === 'GET') {
    try {
      const token = await getAccessToken();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ access_token: token, expires_in: 3600 }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  // POST /send - Send notification
  if (req.url === '/send' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { fcmToken, notification } = JSON.parse(body);

        if (!fcmToken || !notification) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({ error: 'Missing fcmToken or notification' }),
          );
          return;
        }

        const accessToken = await getAccessToken();
        const result = await sendNotification(
          fcmToken,
          notification,
          accessToken,
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // Health check
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'fcm-token-server' }));
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log('🚀 FCM Token Server running on http://localhost:' + PORT);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /token  - Get OAuth2 access token');
  console.log('  POST /send   - Send FCM notification');
  console.log('  GET  /health - Health check');
  console.log('');
});
