import * as crypto from 'crypto'
export const jwtConstants = {
  secret: crypto.randomBytes(20).toString('hex'),
};

