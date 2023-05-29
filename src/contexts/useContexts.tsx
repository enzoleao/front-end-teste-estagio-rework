import api from '@/service/api'
import { message } from 'antd'
import { createContext, useContext, useEffect, useState } from 'react'

type ContextsTypes = {
  allCompanies: any[]
  allSectors: any
  setAllCompanies: any
  messageApi: any
  contextHolder: any
  successAlert: any
  setOrderPages: any
  orderPages: boolean
  pageToShowOnTable: number
  setPageToShowOnTable: any
  maxPage: number
  setComponentToShowHome: any
  componentToShowHome: boolean
}

export const AllContexts = createContext({} as ContextsTypes)

export function ContextsProvider({ children }: any) {
  const [allCompanies, setAllCompanies] = useState<any>()
  const [allSectors, setAllSectors] = useState<any>()
  const [messageApi, contextHolder] = message.useMessage()
  const [orderPages, setOrderPages] = useState(false)
  const [pageToShowOnTable, setPageToShowOnTable] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [componentToShowHome, setComponentToShowHome] = useState(true)
  const successAlert = (data: any) => {
    messageApi.open({
      type: data.type,
      content: data.content,
    })
  }
  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const response = await api.get(`/companies?order=${orderPages}`)
        setAllCompanies(response.data.companies.data)
        setPageToShowOnTable(response.data.companies.current_page)
        setMaxPage(response.data.companies.last_page)
      } catch (err) {
        console.log(err)
      }
    }
    const getAllSectors = async () => {
      try {
        const response = await api.get('/sectors')
        setAllSectors(response.data)
      } catch (err) {
        console.log(err)
      }
    }
    getAllSectors()
    getAllCompanies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <AllContexts.Provider
      value={{
        allCompanies,
        allSectors,
        setAllCompanies,
        messageApi,
        contextHolder,
        successAlert,
        orderPages,
        setOrderPages,
        pageToShowOnTable,
        setPageToShowOnTable,
        setComponentToShowHome,
        componentToShowHome,
        maxPage,
      }}
    >
      {children}
    </AllContexts.Provider>
  )
}

export const useAllContexts = () => useContext(AllContexts)
