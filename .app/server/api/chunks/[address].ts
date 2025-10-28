import { defineEventHandler } from 'h3';
import fs from 'fs';
import path from 'path';

export default defineEventHandler((event) => {
  return new Promise((resolve, reject) => {
    const soundAddress = getRouterParam(event, 'address');
    if (!soundAddress) {
      reject({ statusCode: 400, message: 'No address provided' });
      return;
    }
    const chunksDir = path.join(
      process.cwd(),
      '.app',
      'public',
      'uploads',
      soundAddress,
      'chunks',
    );
    fs.readdir(chunksDir, (err, files) => {
      if (err) {
        reject({ statusCode: 500, message: 'Error reading chunks directory' });
      }
      else {
        resolve(files);
      }
    });
  });
});
