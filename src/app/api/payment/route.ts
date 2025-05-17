import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize the Stripe client
const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string, 
   // Use the latest Stripe API version
);

export async function GET() {
  try {
    // Fetch current user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ status: 404, message: "User not found." });
    }

    // Ensure required environment variables are set
    const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;
    if (!priceId) {
      return NextResponse.json({ status: 500, message: "Price ID is missing in environment variables." });
    }

    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;
    if (!hostUrl) {
      return NextResponse.json({ status: 500, message: "Host URL is missing in environment variables." });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${hostUrl}/payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${hostUrl}/payment?cancel=true`,
    });

    // Return the session URL and customer ID
    return NextResponse.json({
      status: 200,
      session_url: session.url,
      customer_id: session.customer, // Optional: only include if necessary
    });
  } catch (error) {
    console.error("Stripe Error:", error);

    // Handle Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({
        status: 500,
        message: error.message,
        type: error.type,
      });
    }

    // Handle other errors
    return NextResponse.json({ status: 500, message: "An unexpected error occurred." });
  }
}