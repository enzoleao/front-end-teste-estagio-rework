import React from 'react'
import styles from './Home.module.scss'
import { HomeTable } from '@/components/Table/Table'
import { Header } from '@/components/Header'
import { useAllContexts } from '@/contexts/useContexts'
import { RegisterCompany } from '@/components/RegisterCompany'
import { Spin } from 'antd'

export default function Home() {
  const { componentToShowHome, isLoading } = useAllContexts()
  return (
    <div className={styles.homeWrapper}>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Header />
          <div className={styles.homeContainer}>
            {componentToShowHome ? <HomeTable /> : <RegisterCompany />}
          </div>
        </>
      )}
    </div>
  )
}
