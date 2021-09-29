import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export function SignInButton() {
    const isUserLogged = true;

    return isUserLogged ? (
        <button className={styles.SignInButton} type="button">
            <FaGithub color="#04D361"/>
            Rodrigo Melo
            <FiX color="#737380" className={styles.CloseIcon}/>
        </button>
    ) : (
        <button className={styles.SignInButton} type="button">
            <FaGithub color="#EBA417"/>
            Sign in with GitHub 
        </button>
    );
}