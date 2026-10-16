
import { Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null,
});

const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const worker = new Worker(
    'email-queue',
    async (job) => {
        const { email, failFirstAttempts = false } = job.data;

    console.log(`Iniciando Job ${job.id}: envío a ${email}`);
    console.log(`Intento actual: ${job.attemptsMade + 1}`);

    // Simulando un proceso que tarda cinco segundos.
    await sleep(5000);

    if (failFirstAttempts && job.attemptsMade < 2) {
        console.log(`Fallo simulado en el Job ${job.id}`);

        throw new Error('Fallo simulado al enviar el correo');
    }

    console.log(`Correo enviado correctamente a ${email}`);

    return {
        success: true,
        email,
        };
    },
    {
    connection,
    }
);

worker.on('completed', (job, result) => {
    console.log(`Job ${job.id} completado`, result);
});

worker.on('failed', (job, error) => {
    console.error(
    `Job ${job?.id} falló en el intento ${job?.attemptsMade}:`,
    error.message
    );
});

worker.on('error', (error) => {
    console.error('Error del Worker:', error.message);
});

console.log('Worker iniciado. Esperando trabajos...');
