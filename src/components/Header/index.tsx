import styles from './Header.module.scss'
import { useAllContexts } from '@/contexts/useContexts'

export function Header() {
    const { setComponentToShowHome} = useAllContexts()
    return (
        <div className={styles.headerWrapper}>
            <div>
                <button onClick={()=>setComponentToShowHome(true)}>HOME</button>
                <button onClick={()=>setComponentToShowHome(false)}>CADASTRAR EMPRESA</button>
            </div>
        </div>
    )
}