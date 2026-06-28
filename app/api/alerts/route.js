// app/api/alerts/route.js - Servidor de Gestión de Alertas Logísticas Internas para Agentes
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const ALERTS_FILE_PATH = path.join(process.cwd(), 'data', 'alerts.json');

// Asegurar que exista la carpeta data y el archivo alerts.json
function ensureAlertsFile() {
  const dir = path.dirname(ALERTS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(ALERTS_FILE_PATH)) {
    fs.writeFileSync(ALERTS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

export async function POST(request) {
  try {
    const alert = await request.json();
    ensureAlertsFile();

    // 1. Leer alertas existentes y añadir la nueva
    const fileContent = fs.readFileSync(ALERTS_FILE_PATH, 'utf-8');
    let alertsList = [];
    try {
      alertsList = JSON.parse(fileContent);
    } catch (e) {
      alertsList = [];
    }

    alertsList.push(alert);
    // Limitar el archivo a las últimas 100 alertas para evitar sobrecargar el espacio en disco
    if (alertsList.length > 100) {
      alertsList = alertsList.slice(-100);
    }

    fs.writeFileSync(ALERTS_FILE_PATH, JSON.stringify(alertsList, null, 2), 'utf-8');
    console.log(`[Alerts API] Nueva anomalía tipo "${alert.type}" registrada en data/alerts.json.`);

    // 2. Intentar enviar correo a los destinos de logística configurados
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const recipientEmails = ['xotafor@gmail.com', 'yezelmax@gmail.com'];

    if (smtpHost && smtpUser && smtpPass) {
      console.log(`[Alerts API] Iniciando envío de correo de alerta logística...`);

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const mailOptions = {
        from: `"IdarThur Sistema de Alertas" <${smtpUser}>`,
        to: recipientEmails.join(', '),
        subject: `🚨 ANOMALÍA LOGÍSTICA DETECTADA: ${alert.type} en IdarThur`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
            <h2 style="color: #ff0055; border-bottom: 2px solid #ff0055; padding-bottom: 10px; margin-top: 0;">
              🚨 Alerta de Anomalía Crítica Detectada por Agentes IA
            </h2>
            <p>Se ha reportado una anomalía automatizada de forma interna en la plataforma <strong>IdarThur.com</strong>.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 180px;">Tipo de Anomalía:</td>
                <td style="padding: 10px; border: 1px solid #ddd; color: #ff0055; font-weight: bold;">${alert.type}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Mensaje:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${alert.message}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Página URL:</td>
                <td style="padding: 10px; border: 1px solid #ddd;"><a href="${alert.pageUrl}" target="_blank">${alert.pageUrl}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Estampa de Tiempo:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${alert.timestamp}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Zona Horaria Cliente:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${alert.timezone} (${alert.language})</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Detalles Técnicos:</td>
                <td style="padding: 10px; border: 1px solid #ddd;"><pre style="background: #f1f1f1; padding: 10px; border-radius: 5px; overflow-x: auto; margin: 0;">${JSON.stringify(alert.details, null, 2)}</pre></td>
              </tr>
            </table>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 0.85rem; color: #888;">
              Este es un correo automático generado internamente por la red de agentes inteligentes de IdarThur.com. No respondas a este remitente.
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`[Alerts API] Correo de alerta despachado a: ${recipientEmails.join(', ')}`);
    } else {
      console.log(`[Alerts API] Correo no enviado. SMTP no está configurado en las variables de entorno. Alerta persistida en local.`);
    }

    return new Response(JSON.stringify({ success: true, count: alertsList.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Alerts API Endpoint Error]', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
