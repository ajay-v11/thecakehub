'use server';

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

type OrderInfo = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: {name: string; quantity: number; price: number}[];
  total: number;
};

type EmailType = 'orderReceived' | 'orderConfirmed' | 'orderDelivered';

export async function sendOrderEmail(order: OrderInfo, type: EmailType) {
  try {
    if (!order || !type) {
      return {message: 'Order info and email type are required', status: 400};
    }

    const templates = {
      orderReceived: getOrderReceivedTemplate(order),
      orderConfirmed: getOrderConfirmedTemplate(order),
      orderDelivered: getOrderDeliveredTemplate(order),
    };

    const msg = {
      to: order.customerEmail,
      from: 'heraappollo@gmail.com', // Must be verified in SendGrid
      subject: getEmailSubject(type),
      html: templates[type],
    };

    await sgMail.send(msg);
    return {message: 'Email sent successfully!', status: 200};
  } catch (error) {
    console.error('Error sending email:', error);
    return {message: 'Error sending email', status: 500};
  }
}

function getEmailSubject(type: EmailType) {
  const subjects = {
    orderReceived: '🍰 Your Bakery Order Has Been Received!',
    orderConfirmed: '✅ Your Bakery Order is Confirmed!',
    orderDelivered: '🚚 Your Bakery Order Has Been Delivered!',
  };
  return subjects[type];
}

function getOrderReceivedTemplate(order: OrderInfo) {
  return `
      <h1>🍰 Thank You for Your Order, ${order.customerName}!</h1>
      <p>We’ve received your order and will start preparing it soon.</p>
      <h2>Order Details:</h2>
      ${getOrderItemsTable(order)}
      <p><b>Total: $${order.total.toFixed(2)}</b></p>
      <p>We’ll notify you once your order is confirmed.</p>
    `;
}

function getOrderConfirmedTemplate(order: OrderInfo) {
  return `
      <h1>✅ Your Order is Confirmed, ${order.customerName}!</h1>
      <p>Our bakers are working their magic! Your order is being prepared.</p>
      <h2>Order Details:</h2>
      ${getOrderItemsTable(order)}
      <p><b>Total: $${order.total.toFixed(2)}</b></p>
      <p>We’ll let you know once your order is out for delivery. 🎉</p>
    `;
}

function getOrderDeliveredTemplate(order: OrderInfo) {
  return `
      <h1>🚚 Your Order Has Arrived, ${order.customerName}!</h1>
      <p>We hope you enjoy your treats! 🍪</p>
      <h2>Order Summary:</h2>
      ${getOrderItemsTable(order)}
      <p><b>Total Paid: $${order.total.toFixed(2)}</b></p>
      <p>Thank you for choosing our bakery! 🧁</p>
    `;
}

function getOrderItemsTable(order: OrderInfo) {
  return `
      <table border="1" cellspacing="0" cellpadding="8">
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
          </tr>
        `
          )
          .join('')}
      </table>
    `;
}
