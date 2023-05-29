import api from '@/service/api';
import { useEffect, useState } from 'react';
import { Space, Table, Menu, Input, Button, Select, Dropdown, Switch, Modal  } from 'antd';
import { BiEdit } from 'react-icons/bi'
import styles from './Table.module.scss'
import { useAllContexts } from '@/contexts/useContexts';
import { EditModal } from '../Modals';
import { SearchOutlined, LeftOutlined, RightOutlined, FilterOutlined, ExclamationCircleOutlined  } from '@ant-design/icons';
import { BsTrash } from 'react-icons/bs'
const { confirm } = Modal;
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];

interface DataType {
  id: React.Key;
  name: string;
  cnpj: any;
  sectors: any[]
}
function getItem(
  label: React.ReactNode,
  key: React.Key,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    children,
    label,
    type,
  } as MenuItem;
}
export function HomeTable () {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [rowData, setRowData] = useState()
    const { allCompanies, contextHolder, orderPages, setOrderPages, setAllCompanies, pageToShowOnTable, setPageToShowOnTable, maxPage, successAlert } = useAllContexts()
    const [searchMode, setSearchMode] = useState('Empresa')
    const [companyName, setCompanyName] = useState('')

    const showModal = async (updateData: any) => {
      setRowData((prevState: any) => ({...prevState,
        id: updateData.id, 
        name: updateData.name,
        cnpj: updateData.cnpj,
        sectors: updateData.sectors.map(({ id }: any) => id)}),
        )
      setIsEditModalOpen(true);
    };
    const orderResults = async()=> {
      setOrderPages(!orderPages)
      const response = await api.get(`/companies?page=${pageToShowOnTable}&order=${!orderPages}`)
      setAllCompanies(response.data.companies.data)
    }
    const handleChangeSearchMode = (data: any)=> {
      console.log(data)
      setSearchMode(data)
    }
    const searchCompany = async () => {
      setOrderPages(false)
      if (searchMode === 'Empresa' || companyName === '') {
        const response = await api.get(`/companies/${companyName}`)
        companyName === ''
          ? setAllCompanies(response.data.companies.data)
          : setAllCompanies(response.data.companies)
      } else {
        const response = await api.get(`/search/${companyName}`)
        setAllCompanies(response.data.companies)
      }
      setPageToShowOnTable(1)
    }
    const nextPage = async () => {
      setPageToShowOnTable(pageToShowOnTable + 1)
      const response = await api.get(`/companies?page=${pageToShowOnTable + 1}&order=${orderPages}`)
      setAllCompanies(response.data.companies.data)
    }
    const lastPage = async () => {
      setPageToShowOnTable(pageToShowOnTable - 1)
      const response = await api.get(`/companies?page=${pageToShowOnTable - 1}&order=${orderPages}`)
      setAllCompanies(response.data.companies.data)
    }
    const columns = [
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
        width:'450px'
      },
      {
        title: 'CNPJ',
        dataIndex: 'cnpj',
        key: 'cnpj'
      },
      {
        title: 'Setores',
        dataIndex: 'sectors',
        key:'id',
        render: (sectors: any)=>{
          const itens =[ 
          getItem('VISUALIZAR', 'sub4', 
            sectors.map((i: any)=>{
              return getItem(`${i.name}`, `${i.name}`)
            })
          )]
          return (
          <Menu
            style={{ width: 256, border:'none', background:'none' }}
            mode="inline"
            selectable={false}
            items={itens}
          />
        )}
      },
      {
        title: 'Ações',
        key:'id',
        render: (record: DataType)=>(
          <Space size="middle">
            <BiEdit className='h-5 w-5 cursor-pointer' onClick={()=> showModal(record)} />
            <BsTrash className='h-5 w-5 cursor-pointer' onClick={()=> handleDeleteCompany(record)} />
          </Space>
        )
      }
    ]
    const items: MenuProps['items'] = [
      {
        key: '3',
        label: (
          <p>Ordem alfabetica <Switch checked={orderPages}  onChange={orderResults} /></p>
        ),
      },
    ];
    const searchOptions = [
      {
        value: 'Empresa',
        label: 'Empresa',
      },
      {
        value: 'Setores',
        label: 'Setores',
      },
    ];
    const handleDeleteCompany = (data: DataType)=> {
      confirm({
        title: 'Você tem certeza que deseja deletar essa empresa?',
        icon: <ExclamationCircleOutlined className='text-red-600' />,
        content: `${data.name}`,
        okText: 'DELETAR',
        okType: 'danger',
        cancelText: 'CANCELAR',
        async onOk() {
          try {
            await api.delete(`/companies/${data.id}`)
            setAllCompanies(allCompanies.filter((obj: any) => obj.id !== data.id))
            successAlert({content: 'Deletado com sucesso', type: 'success'})
          } catch (err) {
            console.log(err)
          }
        },
        onCancel() {
          console.log(data)
        },
      });
    }
    useEffect(()=>{
      searchCompany()
    },[companyName])
    return (
        <div className={styles.homeTableWrapper}>
            <div className={styles.homeTableContainer}>
                <header>
                  <div>
                   <Space.Compact size='large' style={{ width: '100%' }}>
                      <Select onChange={handleChangeSearchMode} defaultValue="Empresa" options={searchOptions} />
                      <Input size='large' onChange={(e)=>setCompanyName(e.target.value)} placeholder={`Pesquisar por ${searchMode}`} />
                      <Button onClick={searchCompany} style={{display: 'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#fff'}}  >
                        <SearchOutlined />
                      </Button>
                    </Space.Compact>
                  </div>
                  <div>
                    <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                      <Button style={{marginRight:'40px', display: 'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#fff'}}>
                          <FilterOutlined  />
                      </Button>
                    </Dropdown>                   
                  </div>
                </header>
                <main>
                    <div className={styles.tableWrapperOverFlow}>
                      <Table style={{width: '100%'}} dataSource={allCompanies} pagination={false} columns={columns} />
                    </div>
                    <footer>
                      <Button style={{display: 'flex', alignItems:'center', justifyContent:'center'}}  icon={<LeftOutlined />} onClick={lastPage} disabled={pageToShowOnTable<= 1} size="large" />
                        <p className="w-[40px] h-[40px] rounded-md bg-stone-300 flex items-center justify-center">{pageToShowOnTable}</p>
                      <Button style={{display: 'flex', alignItems:'center', justifyContent:'center'}}  icon={<RightOutlined />} onClick={nextPage} disabled={pageToShowOnTable>=maxPage} size="large" />
                    </footer>
                </main>
            </div>
            <EditModal setIsModalOpen={setIsEditModalOpen}  isModalOpen={isEditModalOpen} rowData={rowData} />
            {contextHolder}          
        </div>
    )
}