import { Worker, Queue } from "bullmq";
import { sendEmail } from "../mail-service/sendMail.js";
import { redisConnection } from "../lib/redisConnections.js";
export const emailQueue = new Queue("emails", {
  connection: redisConnection,
});
const emailWorker = new Worker(
  "emails",
  async (job) => {
    console.log("Processing email job:", job.id);

    const { to, body } = job.data;
    console.log("TO: " + to + " VERIFICATION CODE :" + body);

    // Trimite email
    await sendEmail(to, body);

    console.log("Email sent to:", to);

    return { success: true, emailSent: to };
  },
  {
    connection: redisConnection.duplicate(),
  },
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
