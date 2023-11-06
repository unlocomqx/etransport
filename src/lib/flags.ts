import { env } from '$env/dynamic/public';

// times in milliseconds
// distances in meters

export const DEBUG = env.PUBLIC_DEBUG === 'true';
export const GROUP_RADIUS = 20;
export const GROUP_TIMESPAN = 30;
export const TRACKING_THRESHOLD = 1000;
export const TRACKING_NOTIFICATION_DELAY = 1000 * 10;
export const TRACKING_IDLE_DELAY = 1000 * 60 * 3;
export const TRACKING_IDLE_MIN_TIME = TRACKING_IDLE_DELAY - 1000 * 30;
export const TRACKING_IDLE_RADIUS = 100;
export const HEADING_LIFESPAN = 1000 * 30;
export const MARKER_LIFESPAN = 1000 * 60 * 60;