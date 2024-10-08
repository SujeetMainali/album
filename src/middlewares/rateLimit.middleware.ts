import rateLimit from 'express-rate-limit'

const createRateLimiter = (maxRequests: number, windowMs: number, message?: string) => {
  return rateLimit({
    windowMs, // Window duration in milliseconds
    max: maxRequests, // Maximum number of requests allowed
    message: message ?? 'Too many requests from this IP, please try again after a minute.',
  })
}

export const loginRateLimiter = createRateLimiter(2, 1 * 60 * 1000)
export const forgetPasswordRateLimiter = createRateLimiter(2, 1 * 60 * 1000)
export const verifyOTPRateLimiter = createRateLimiter(2, 1 * 60 * 1000)
