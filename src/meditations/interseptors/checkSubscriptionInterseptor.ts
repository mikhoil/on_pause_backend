import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable, map } from 'rxjs';

@Injectable()
export class CheckSubscriptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    return next.handle().pipe(
      map(data =>
        data.map(({ id, title, forSubs, meditations }) =>
          !user.subscriber && forSubs
            ? {
                id,
                title,
                forSubs,
                meditations: meditations?.map(({ url, ...other }) => other),
              }
            : { id, title, forSubs, meditations },
        ),
      ),
    );
  }
}

