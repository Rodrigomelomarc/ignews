import { useSession, signIn } from 'next-auth/client'

import styles from './styles.module.scss';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

interface SubscriptionButtonProps {
    priceId: string;
}

export function SubscriptionButton({ priceId }: SubscriptionButtonProps) {
    const [ session ] = useSession();

    async function handleSubscription() {
        if (!session) {
            signIn('github')
            return;
        }

        try {
            const response = await api.post('/subscribe');
        
            const { sessionId } = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({ sessionId })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <button
            type="button"
            className={styles.subscriptionButton}
            onClick={() => handleSubscription()}
        >
            Subscribe now
        </button>
    );
}