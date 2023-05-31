import api from '@/service/api'
import styles from './Table.module.scss'
import { useEffect, useState } from 'react'
import {
  Space,
  Table,
  Menu,
  Input,
  Button,
  Select,
  Switch,
  Modal,
  Empty,
  ConfigProvider,
  Popover,
} from 'antd'
import { BiEdit } from 'react-icons/bi'
import { useAllContexts } from '@/contexts/useContexts'
import { EditModal } from '../Modals'
import {
  SearchOutlined,
  LeftOutlined,
  RightOutlined,
  FilterOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { BsTrash } from 'react-icons/bs'
import type { MenuProps } from 'antd'
const { confirm } = Modal
type MenuItem = Required<MenuProps>['items'][number]

interface DataType {
  // eslint-disable-next-line no-undef
  id: React.Key
  name: string
  cnpj: any
  sectors: any[]
}
function getItem(
  // eslint-disable-next-line no-undef
  label: React.ReactNode,
  // eslint-disable-next-line no-undef
  key: React.Key,
  children?: MenuItem[],
  type?: 'group',
  click?: any,
): MenuItem {
  return {
    key,
    children,
    label,
    type,
    click,
  } as MenuItem
}
export function HomeTable() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [rowData, setRowData] = useState()
  const {
    allCompanies,
    contextHolder,
    orderPages,
    setOrderPages,
    setAllCompanies,
    pageToShowOnTable,
    setPageToShowOnTable,
    maxPage,
    successAlert,
    setMaxPage,
  } = useAllContexts()
  const [searchMode, setSearchMode] = useState('Empresa')
  const [companyName, setCompanyName] = useState('')

  const showModal = async (updateData: any) => {
    setRowData((prevState: any) => ({
      ...prevState,
      id: updateData.id,
      name: updateData.name,
      cnpj: updateData.cnpj,
      sectors: updateData.sectors.map(({ id }: any) => id),
    }))
    setIsEditModalOpen(true)
  }
  const orderResults = async () => {
    setCompanyName('')
    setOrderPages(!orderPages)
    const response = await api.get(
      `/companies?page=${pageToShowOnTable}&order=${!orderPages}`,
    )
    setAllCompanies(response.data.companies.data)
  }
  const handleChangeSearchMode = (data: any) => {
    setCompanyName('')
    setSearchMode(data)
  }
  const searchCompany = async () => {
    if (searchMode === 'Empresa' || companyName === '') {
      const response = await api.get(
        `/companies/${companyName}?order=${orderPages}`,
      )
      companyName === ''
        ? setAllCompanies(response.data.companies.data)
        : setAllCompanies(response.data.companies)
    } else {
      const response = await api.get(
        `/search/${companyName}?order=${orderPages}`,
      )
      setAllCompanies(response.data.companies)
    }
    setPageToShowOnTable(1)
  }
  const nextPage = async () => {
    setPageToShowOnTable(pageToShowOnTable + 1)
    const response = await api.get(
      `/companies?page=${pageToShowOnTable + 1}&order=${orderPages}`,
    )
    setAllCompanies(response.data.companies.data)
  }
  const lastPage = async () => {
    setPageToShowOnTable(pageToShowOnTable - 1)
    const response = await api.get(
      `/companies?page=${pageToShowOnTable - 1}&order=${orderPages}`,
    )
    setAllCompanies(response.data.companies.data)
  }
  const handleDeleteCompany = (data: DataType) => {
    confirm({
      title: 'Você tem certeza que deseja deletar essa empresa?',
      icon: <ExclamationCircleOutlined className="text-red-600" />,
      content: `${data.name}`,
      okText: 'DELETAR',
      okType: 'danger',
      cancelText: 'CANCELAR',
      async onOk() {
        try {
          await api.delete(`/companies/${data.id}`)
          successAlert({ content: 'Deletado com sucesso', type: 'success' })
          if (
            pageToShowOnTable === maxPage &&
            allCompanies.length === 1 &&
            pageToShowOnTable > 1
          ) {
            const response = await api.get(
              `/companies?page=${pageToShowOnTable - 1}&order=${orderPages}`,
            )
            setPageToShowOnTable(pageToShowOnTable - 1)
            setAllCompanies(response.data.companies.data)
            setMaxPage(pageToShowOnTable - 1)
          } else {
            setAllCompanies(
              allCompanies.filter((obj: any) => obj.id !== data.id),
            )
          }
        } catch (err) {
          console.log(err)
        }
      },
      onCancel() {
        console.log(data)
      },
    })
  }
  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'id',
      width: '450px',
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj',
      key: 'id',
    },
    {
      title: 'Setores',
      dataIndex: 'sectors',
      key: 'id',
      render: (sectors: any) => {
        const itens = [
          getItem(
            'VISUALIZAR',
            'sub4',
            sectors.map((i: any) => {
              return getItem(`${i.name}`, `${i.id}`)
            }),
          ),
        ]
        return (
          <Menu
            className={styles.selectEditUl}
            style={{ width: 256, border: 'none', background: 'none' }}
            mode="inline"
            selectable={false}
            items={itens}
          />
        )
      },
    },
    {
      title: 'Ações',
      key: 'id',
      render: (record: DataType) => (
        <Space size="middle">
          <BiEdit
            className="h-5 w-5 cursor-pointer text-blue-700 hover:text-blue-800"
            onClick={() => showModal(record)}
          />
          <BsTrash
            className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-600"
            onClick={() => handleDeleteCompany(record)}
          />
        </Space>
      ),
    },
  ]

  const searchOptions = [
    {
      value: 'Empresa',
      label: 'Empresa',
    },
    {
      value: 'Setores',
      label: 'Setores',
    },
  ]

  useEffect(() => {
    searchCompany()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName])
  const customizeRenderEmpty = () => (
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {Empty.PRESENTED_IMAGE_SIMPLE}
      <p>Nenhuma empresa {companyName !== '' ? 'localizada' : 'cadastrada'}</p>
    </div>
  )
  const content = (
    <div>
      <p>
        Ordem alfabetica <Switch checked={orderPages} onChange={orderResults} />
      </p>
    </div>
  )
  return (
    <div className={styles.homeTableWrapper}>
      <div className={styles.homeTableContainer}>
        <header>
          <div>
            <Space.Compact size="large" style={{ width: '100%' }}>
              <Select
                style={{ minWidth: '120px' }}
                onChange={handleChangeSearchMode}
                defaultValue="Empresa"
                options={searchOptions}
              />
              <Input
                size="large"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={`Pesquisar por ${searchMode}`}
              />
              <Button
                onClick={searchCompany}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <SearchOutlined />
              </Button>
            </Space.Compact>
          </div>
          <div>
            <Popover placement="bottom" content={content}>
              <Button
                style={{
                  marginRight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <FilterOutlined className="text-blue-700" />
              </Button>
            </Popover>
          </div>
        </header>
        <main>
          <div className={styles.tableWrapperOverFlow}>
            <ConfigProvider renderEmpty={customizeRenderEmpty}>
              <Table
                rowKey="id"
                style={{ width: '100%' }}
                dataSource={allCompanies}
                pagination={false}
                columns={columns}
              />
            </ConfigProvider>
          </div>
          <footer>
            <Button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              icon={<LeftOutlined />}
              onClick={lastPage}
              disabled={pageToShowOnTable <= 1}
              size="large"
            />
            <p className="w-[40px] h-[40px] rounded-md bg-stone-300 flex items-center justify-center">
              {pageToShowOnTable}
            </p>
            <Button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              icon={<RightOutlined />}
              onClick={nextPage}
              disabled={pageToShowOnTable >= maxPage}
              size="large"
            />
          </footer>
        </main>
      </div>
      <EditModal
        setIsModalOpen={setIsEditModalOpen}
        isModalOpen={isEditModalOpen}
        rowData={rowData}
      />
      {contextHolder}
    </div>
  )
}
