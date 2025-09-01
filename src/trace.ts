// trace.ts
import crypto from 'crypto';

// Generate a container-unique ID once at startup
// (persists for this container's lifetime)
export const CONTAINER_ID = crypto.randomUUID();
