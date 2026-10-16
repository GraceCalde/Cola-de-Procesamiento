
import express from 'express';
import { emailQueue } from './queue.js';

const app = express();
const PORT = 3001;

app.use(express.json());

app.post('/jobs/email', async (req, res) => {
    try {
    const { email, failFirstAttempts = false } = req.body;

    if (!email) {
        return res.status(400).json({
        error: 'El correo electrónico es obligatorio',
        });
    }

    const job = await emailQueue.add(
        'send-email',
        { email, failFirstAttempts },
        {
        attempts: 3,
        backoff: {
            type: 'fixed',
            delay: 1000,
        },
        removeOnComplete: false,
        removeOnFail: false,
        }
    );

    return res.status(202).json({
        message: 'Trabajo agregado a la cola',
        jobId: job.id,
    });
    } catch (error) {
    console.error('Error agregando el trabajo:', error.message);

    return res.status(500).json({
        error: 'No se pudo agregar el trabajo a la cola',
    });
    }
});

app.listen(PORT, () => {
    console.log(`Productor ejecutándose en http://localhost:${PORT}`);
});
