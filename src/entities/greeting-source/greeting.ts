import type { GreetingSource } from '@/entities/greeting-source';

export const buildGreeting = (source: GreetingSource): string => `こんにちは、${source.name}さん`;
