import { IncomingMessage } from 'node:http';
import { request as httpsRequest, RequestOptions } from 'node:https';

export function request(
  url: string,
  body?: any,
  options?: RequestOptions
): Promise<{ body: Buffer; response: IncomingMessage }> {
  return new Promise((resolve, reject) => {
    let data: Buffer[] = [];

    const req = httpsRequest(url, { method: 'GET', ...options }, (res) => {
      res.on('data', (chunk) => {
        if (!(chunk instanceof Buffer)) chunk = Buffer.from(chunk);

        data.push(chunk);
      });

      res.on('close', () => {
        resolve({ body: Buffer.concat(data), response: res });
      });
    });

    req.on('error', reject);

    if (body) req.write(body);

    req.end();
  });
}
