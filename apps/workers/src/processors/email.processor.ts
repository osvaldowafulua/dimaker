import type { Job } from 'bullmq';

export function createEmailProcessor() {
  return async (job: Job<{ orderId?: string; sessionId?: string }>) => {
    console.log(`[email.send]`, job.data);
    return { ok: true };
  };
}
