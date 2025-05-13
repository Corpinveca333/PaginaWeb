import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Interfaz esperada para los datos del cuerpo de la solicitud
interface RequestBody {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  message?: string;
  requestList: Array<{
    id: string;
    name: string; // o title, el nombre del producto/servicio
    sku?: string; // si aplica
    price?: number; // si aplica
    quantity?: number; // si tienes cantidades en tu lista
    // añade cualquier otro campo que tengas en tu requestList y quieras enviar
  }>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    const { fullName, email, phone, companyName, message, requestList } = body;

    // Validación simple (puedes expandirla)
    if (!fullName || !email || !requestList || requestList.length === 0) {
      return NextResponse.json(
        { message: 'Faltan campos requeridos o la lista de solicitud está vacía.' },
        { status: 400 }
      );
    }

    // 1. Crear una cuenta de prueba en Ethereal (solo para desarrollo)
    // En un entorno de producción, configurarías un transporter con tus credenciales SMTP reales.
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host, // Servidor SMTP de Ethereal
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // Usuario generado por Ethereal
        pass: testAccount.pass, // Contraseña generada por Ethereal
      },
      // Si usas Gmail directamente en el futuro, necesitarías algo como:
      // host: 'smtp.gmail.com',
      // port: 465,
      // secure: true,
      // auth: {
      //   user: process.env.GMAIL_USER,
      //   pass: process.env.GMAIL_APP_PASSWORD, // Contraseña de aplicación de Gmail
      // },
    });

    // 2. Construir el contenido del correo
    let requestListHtml = '<ul>';
    requestList.forEach(item => {
      requestListHtml += `<li>${item.name} (SKU: ${item.sku || 'N/A'}, Precio: ${item.price !== undefined ? `$${item.price}` : 'N/A'}, Cantidad: ${item.quantity || 1})</li>`;
    });
    requestListHtml += '</ul>';

    const mailOptions = {
      from: '"Formulario Web Corpinveca" <noreply@corpinveca-dev.com>', // Puedes poner lo que quieras aquí para Ethereal
      to: 'corpinvecaweb@gmail.com', // El destinatario real
      replyTo: email, // Para que al responder, se responda al cliente
      subject: `Nueva Solicitud de Información - ${fullName}`,
      text: `
        Nueva Solicitud de Información:
        Nombre: ${fullName}
        Email: ${email}
        Teléfono: ${phone || 'No proporcionado'}
        Empresa: ${companyName || 'No proporcionada'}
        Mensaje: ${message || 'No proporcionado'}

        Ítems Solicitados:
        ${requestList.map(item => `- ${item.name} (SKU: ${item.sku || 'N/A'}, Precio: ${item.price !== undefined ? `$${item.price}` : 'N/A'}, Cantidad: ${item.quantity || 1})`).join('\n')}
      `,
      html: `
        <h2>Nueva Solicitud de Información</h2>
        <p><strong>Nombre:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <p><strong>Empresa:</strong> ${companyName || 'No proporcionada'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message || 'No proporcionado'}</p>
        <hr />
        <h3>Ítems Solicitados:</h3>
        ${requestListHtml}
      `,
    };

    // 3. Enviar el correo
    const info = await transporter.sendMail(mailOptions);

    console.log('Mensaje enviado: %s', info.messageId);
    // URL de previsualización de Ethereal. Solo si estás usando createTestAccount().
    console.log('URL de Previsualización (Ethereal): %s', nodemailer.getTestMessageUrl(info));

    return NextResponse.json(
      {
        message:
          'Solicitud enviada con éxito. Revisa la URL de previsualización en la consola del servidor.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en API de envío de solicitud:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { message: 'Error al enviar la solicitud.', error: errorMessage },
      { status: 500 }
    );
  }
}
