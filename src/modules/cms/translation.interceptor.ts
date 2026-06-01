import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { TranslationService } from './translation.service';

@Injectable()
export class TranslationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TranslationInterceptor.name);
  private readonly SUPPORTED_LANGS = ['fr', 'es', 'pt'];

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private translationService: TranslationService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Only intercept GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    const lang = request.headers['x-lang'] || request.query.lang;
    const isSupportedLang = lang && this.SUPPORTED_LANGS.includes(lang.toLowerCase());

    if (!isSupportedLang) {
      return next.handle();
    }

    const normalizedLang = lang.toLowerCase();
    // Use the originalUrl as the cache key along with the language
    // Remove the ?lang= param if it's there so the URL is stable
    const cleanUrl = request.originalUrl.split('?')[0];
    const queryStr = Object.keys(request.query)
      .filter(k => k !== 'lang')
      .sort()
      .map(k => `${k}=${request.query[k]}`)
      .join('&');
    const finalUrl = queryStr ? `${cleanUrl}?${queryStr}` : cleanUrl;

    const cacheKey = `trans_${normalizedLang}_${finalUrl}`;

    return from(this.cacheManager.get(cacheKey)).pipe(
      switchMap((cachedResponse: any) => {
        if (cachedResponse) {
          return of(cachedResponse);
        }

        // Handle the route and intercept the response
        return next.handle().pipe(
          switchMap((data: any) => {
            // Translate the data
            return from(this.translationService.translateObject(data, normalizedLang)).pipe(
              switchMap(async (translatedData) => {
                try {
                  // Cache the translation for 1 hour
                  await this.cacheManager.set(cacheKey, translatedData, 3600);
                } catch (err) {
                  this.logger.error(`Failed to cache translation for ${cacheKey}`, err);
                }
                return translatedData;
              })
            );
          })
        );
      })
    );
  }
}
