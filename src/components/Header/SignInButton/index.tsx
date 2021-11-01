import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { useSession, signIn, signOut } from "next-auth/client"

import styles from './styles.module.scss';

export function SignInButton() {
    const [ session ] = useSession();

    return session ? (
        <button 
            className={styles.SignInButton} 
            type="button"
            onClick={() => signOut()}
        >
            <FaGithub color="#04D361"/>
            {session.user.name}
            <FiX color="#737380" className={styles.CloseIcon}/>
        </button>
    ) : (
        <button 
            className={styles.SignInButton} 
            type="button"
            onClick={() => signIn('github')}
        >
            <FaGithub color="#EBA417"/>
            Sign in with GitHub 
        </button>
    );
}