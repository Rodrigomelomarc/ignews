import styles from './styles.module.scss';

export function SubscriptionButton() {
    return (
        <button
            type="button"
            className={styles.subscriptionButton}
        >
            Subscribe now
        </button>
    );
}