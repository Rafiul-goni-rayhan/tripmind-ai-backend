import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface CreateCheckoutParams {
  bookingId: string;
  tripTitle: string;
  amount: number;
  customerEmail: string;
}

export async function createCheckoutSession({
  bookingId,
  tripTitle,
  amount,
  customerEmail,
}: CreateCheckoutParams) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: tripTitle },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: customerEmail,
    success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/booking/cancel`,
    metadata: { bookingId },
  });

  return session;
}

export async function getCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId);
}