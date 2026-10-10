// auth/services/permissions.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { AUTH_SERVICE } from '../../common/constants/service.js';

type CacheEntry = { perms: Set<string>; expiresAt: number };

@Injectable()
export class PermissionsService {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly inflight = new Map<string, Promise<Set<string>>>();
  private readonly ttl: number;

  constructor(
    @Inject(AUTH_SERVICE) private readonly auth: ClientProxy,
    config: ConfigService,
  ) {
    this.ttl = Number(config.get('PERMISSION_CACHE_TTL_MS', 60_000));
  }

  async get(userId: string): Promise<Set<string>> {
    const hit = this.cache.get(userId);
    if (hit && hit.expiresAt > Date.now()) return hit.perms;

    // Nhiều request cùng lúc của một user chỉ tạo 1 lần gọi TCP
    let pending = this.inflight.get(userId);
    if (!pending) {
      pending = firstValueFrom(
        this.auth.send<string[]>({ cmd: 'auth.permissions' }, { userId }).pipe(timeout(3000)),
      )
        .then((list) => {
          const perms = new Set(list);
          this.cache.set(userId, { perms, expiresAt: Date.now() + this.ttl });
          return perms;
        })
        .finally(() => this.inflight.delete(userId));
      this.inflight.set(userId, pending);
    }
    return pending;
  }

  invalidate(userId?: string) {
    userId ? this.cache.delete(userId) : this.cache.clear();
  }
}