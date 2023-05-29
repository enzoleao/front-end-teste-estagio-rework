import React from 'react'
import styles from './Home.module.scss'
import { HomeTable } from '@/components/Table/Table'
import { Header } from '@/components/Header'
import { useAllContexts } from '@/contexts/useContexts'
import { RegisterCompany } from '@/components/RegisterCompany'

export default function Home() {
  const { componentToShowHome } = useAllContexts()
  return (
    <div className={styles.homeWrapper}>
      <Header />
      <div className={styles.homeContainer}>
        {componentToShowHome ? <HomeTable /> : <RegisterCompany />}
      </div>
    </div>
  )
}
