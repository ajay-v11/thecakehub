'use server';

import sgMail from '@sendgrid/mail';
import {CartItem} from '../types';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

type OrderInfo = {
  orderId: number | undefined;
  customerName: string;
  customerEmail: string | null;
  items: CartItem[];
  total: number;
};

// Add a new type for custom orders
type CustomOrderInfo = {
  orderId: number | undefined;
  customerName: string | undefined;
  customerEmail: string;
  description: string | undefined;
};

// Update the EmailType to include custom order types
type EmailType =
  | 'orderReceived'
  | 'orderConfirmed'
  | 'orderDelivered'
  | 'customOrderReceived'
  | 'customOrderConfirmed'
  | 'customOrderDelivered';

// Function to send regular order emails
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

    // Check if this is a valid regular order email type
    if (!templates[type as keyof typeof templates]) {
      return {message: 'Invalid email type for regular order', status: 400};
    }

    const msg = {
      to: order.customerEmail,
      from: 'heraappollo@gmail.com', // Must be verified in SendGrid
      subject: getEmailSubject(type),
      html: templates[type as keyof typeof templates],
    };

    await sgMail.send(msg);
    return {message: 'Email sent successfully!', status: 200};
  } catch (error) {
    console.error('Error sending email:', error);
    return {message: 'Error sending email', status: 500};
  }
}

// New function to send custom order emails
export async function sendCustomOrderEmail(
  order: CustomOrderInfo,
  type: EmailType
) {
  try {
    if (!order || !type) {
      return {
        message: 'Custom order info and email type are required',
        status: 400,
      };
    }

    const templates = {
      customOrderReceived: getCustomOrderReceivedTemplate(order),
      customOrderConfirmed: getCustomOrderConfirmedTemplate(order),
      customOrderDelivered: getCustomOrderDeliveredTemplate(order),
    };

    // Check if this is a valid custom order email type
    if (!templates[type as keyof typeof templates]) {
      return {message: 'Invalid email type for custom order', status: 400};
    }

    const msg = {
      to: order.customerEmail,
      from: 'heraappollo@gmail.com', // Must be verified in SendGrid
      subject: getCustomEmailSubject(type),
      html: templates[type as keyof typeof templates],
    };

    await sgMail.send(msg);
    return {message: 'Email sent successfully!', status: 200};
  } catch (error) {
    console.error('Error sending custom order email:', error);
    return {message: 'Error sending email', status: 500};
  }
}

function getEmailSubject(type: EmailType) {
  const subjects = {
    orderReceived: '🍰 Your Cakehub Order Has Been Received!',
    orderConfirmed: '✅ Your Cakehub Order is Confirmed!',
    orderDelivered: '🚚 Your Cakehub Order Has Been Delivered!',
    customOrderReceived: '🍰 Your Cakehub Order Has Been Received!',
    customOrderConfirmed: '✅ Your Custom Cake Order is Confirmed!',
    customOrderDelivered: '🚚 Your Custom Cake Order Has Been Delivered!',
  };
  return subjects[type];
}

// Separate function for custom order subjects for clarity
function getCustomEmailSubject(type: EmailType) {
  const subjects = {
    customOrderReceived: '🍰 Your Cakehub Order Has Been Received!',
    customOrderConfirmed: '✅ Your Custom Cake Order is Confirmed!',
    customOrderDelivered: '🚚 Your Custom Cake Order Has Been Delivered!',
  };
  return subjects[type as keyof typeof subjects];
}

function getOrderReceivedTemplate(order: OrderInfo) {
  return `
      <h1>🍰 Thank You for Your Order, ${order.customerName}!</h1>
      <p>We've received your order and will start preparing it soon.</p>
      <h2>Order Details:</h2>
      ${getOrderItemsTable(order)}
      <p><b>Total: Rs${order.total.toFixed(2)}</b></p>
      <p>We'll notify you once your order is confirmed.</p>
    `;
}

function getOrderConfirmedTemplate(order: OrderInfo) {
  return `
      <h1>✅ Your Order is Confirmed, ${order.customerName}!</h1>
      <p>Our bakers are working their magic! Your order is being prepared.</p>
      <h2>Order Details:</h2>
      ${getOrderItemsTable(order)}
      <p><b>Total: Rs${order.total.toFixed(2)}</b></p>
      <p>We'll let you know once your order is out for delivery. 🎉</p>
    `;
}

function getOrderDeliveredTemplate(order: OrderInfo) {
  return `
      <h1>🚚 Your Order Has Arrived, ${order.customerName}!</h1>
      <p>We hope you enjoy your treats! 🍪</p>
      <h2>Order Summary:</h2>
      ${getOrderItemsTable(order)}
      <p><b>Total Paid: Rs${order.total.toFixed(2)}</b></p>
      <p>Thank you for choosing our bakery! 🧁</p>
    `;
}

// Templates for custom orders

function getCustomOrderReceivedTemplate(order: CustomOrderInfo) {
  return `
      <h1>🍰 Thank You for Your Order, ${order.customerName}!</h1>
      <p>We've received your custom order and will start preparing it soon.</p>
      <h2>Order Summary:</h2>
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>Your Custom Cake Description:</strong></p>
      <p>${order.description}</p>
      <p>We'll notify you once your order is confirmed.</p>
    `;
}

function getCustomOrderConfirmedTemplate(order: CustomOrderInfo) {
  return `
      <h1>✅ Your Custom Cake Order is Confirmed, ${order.customerName}!</h1>
      <p>Great news! Our cake artists are starting work on your custom creation.</p>
      <h2>Order Details:</h2>
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>Your Custom Cake Description:</strong></p>
      <p>${order.description}</p>
      <p>We'll send you an update when your custom cake is ready for delivery. 🎂</p>
      <p>If we need any additional details about your design, we'll contact you soon.</p>
    `;
}

function getCustomOrderDeliveredTemplate(order: CustomOrderInfo) {
  return `
      <h1>🚚 Your Custom Cake Has Arrived, ${order.customerName}!</h1>
      <p>We hope you love your custom cake creation! 🎂</p>
      <h2>Order Summary:</h2>
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>Your Custom Cake Description:</strong></p>
      <p>${order.description}</p>
      <p>Thank you for choosing our bakery for your special occasion! 🧁</p>
      <p>We'd love to see photos of you enjoying your cake if you'd like to share!</p>
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
            <td>${item.title}</td>
            <td>${item.quantity}</td>
            <td>Rs${item.price.toFixed(2)}</td>
          </tr>
        `
          )
          .join('')}
      </table>
    `;
}
