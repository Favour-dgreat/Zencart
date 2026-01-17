import stripe from 'stripe';

export const Stripe = new stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-12-15.clover',
    });