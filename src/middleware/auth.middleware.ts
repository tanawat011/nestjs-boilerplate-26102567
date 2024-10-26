import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const msgUnauth = 'Unauthorized';
    const msgForb = 'Forbidden';

    try {
      const currTime = new Date().getTime() / 1000;
      const session = req.session as any;

      // NOTE: ----------[Check session is not empty]----------
      if (!session.store) throw new Error(msgUnauth);

      const store = session.store;
      const accessToken = store.accessToken;
      const refreshToken = store.refreshToken;

      // NOTE: ----------[Check token is not empty]----------
      if (!accessToken || !refreshToken) throw new Error(msgUnauth);

      const decodedAt = jwt.verify(accessToken, process.env.JWT_SECRET) as any;
      const decodedRt = jwt.verify(refreshToken, process.env.JWT_SECRET) as any;

      // NOTE: ----------[Check access token still no expired]----------
      if (!decodedAt) throw new Error(msgUnauth);
      if (decodedAt.exp < currTime) throw new Error(msgUnauth);

      // NOTE: ----------[Check refresh token still no expired]----------
      if (!decodedRt) throw new Error(msgUnauth);
      if (decodedRt.exp < currTime) throw new Error(msgUnauth);

      // NOTE: ----------[Generate new access token]----------
      const payload = {
        sub: decodedAt.id,
        username: decodedAt.username,
        userType: decodedAt.userType,
      };
      const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_ACCESS_TOKEN || '1h',
      });

      // NOTE: ----------[Set new access token]----------
      store.accessToken = newAccessToken;

      if (decodedAt.userType === 'customer') {
        const currId = `${decodedAt.sub}`;
        const reqId = `${req.params.id}`;

        // NOTE: ----------[Check if the current user is the same as the requested user]----------
        if (!reqId || currId !== reqId) throw new Error(msgForb);
      }

      next();
    } catch (error) {
      const msg = error.message;

      if (!msg) return res.status(500).send('Internal Server Error');
      if (msg === msgForb) return res.status(403).send(msgForb);

      return res.status(401).send(msgUnauth);
    }
  }
}
