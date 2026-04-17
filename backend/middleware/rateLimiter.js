const tracker = new Map();
export const rateLimiter = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const limit = 5;
  if (!tracker.has(ip)) {
    tracker.set(ip, {
      expiresAt: Date.now(),
      count: 1,
    });
  } else tracker.get(ip).count++;

  const counter = tracker.get(ip);

  console.log("COUNTER: ", counter);
  if (counter.count > limit && counter.expiresAt > Date.now()) {
    console.log("LIMIT EXCEEDED");
    return res.status(400).json({message:"Rate limit exceeded"});
  }
  if (counter.expiresAt < Date.now()) {
    counter.expiresAt = Date.now() + 10000;
    counter.count=0;
  }
  next();
};
