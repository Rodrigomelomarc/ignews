import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from '../../services/stripe';
import { getSession } from 'next-auth/client';
import { fauna } from "../../services/fauna";
import { query as q } from 'faunadb'

type User = {
    data: {
        stripe_customer_id: string;
    },
    ref: {
        id: string
    }
}

export default async(req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const session = await getSession({ req })

        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id;

        if ( !customerId ) {
            const customer = await stripe.customers.create({
                email: session.user.email
            })

            await fauna.query(
                q.Update(
                    q.Ref(
                        q.Collection('users'),
                        user.ref.id
                    ),
                    { data: { stripe_customer_id: customer.id } }
                )
            )

            customerId = customer.id
        }

        const checkout = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: process.env.SUBSCRIPTION_PRICE_ID, quantity: 1 },
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            cancel_url: process.env.SUBSCRIPTION_CANCEL_URL,
            success_url: process.env.SUBSCRIPTION_SUCCESS_URL
        });

        return res.status(200).json({ sessionId: checkout.id });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('method not allowed');
    }
}