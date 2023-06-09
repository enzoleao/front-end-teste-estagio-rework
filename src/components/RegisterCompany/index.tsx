import InputMask from 'react-input-mask'
import styles from './RegisterCompany.module.scss'
import api from '@/service/api'
import { useAllContexts } from '@/contexts/useContexts'
import { Button, Form, Input, Select } from 'antd'
import { useState } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'

export function RegisterCompany() {
  const [form] = Form.useForm()
  const {
    allSectors,
    setAllCompanies,
    allCompanies,
    successAlert,
    contextHolder,
    setMaxPage,
    maxPage,
    pageToShowOnTable,
  } = useAllContexts()
  const [sectorsSelected, setSectorsSelected] = useState<any>([])
  const [inputError, setInputError] = useState<any>()
  const createCompany = async (data: any) => {
    setInputError([])
    try {
      const response = await api.post('/companies', data)
      setAllCompanies([
        ...allCompanies,
        {
          id: response.data.company.id,
          name: data.name,
          cnpj: data.cnpj,
          sectors: allSectors.filter((obj: any) =>
            data.sectors.includes(obj.id),
          ),
        },
      ])
      successAlert({ content: response.data.message, type: 'success' })
      setSectorsSelected([])
      form.resetFields()
      // eslint-disable-next-line no-unused-expressions
      allCompanies.length === 10 && pageToShowOnTable === maxPage
        ? setMaxPage(maxPage + 1)
        : false
    } catch (error: any) {
      error.response.data.error.map((i: any) => {
        return successAlert({ content: i, type: 'error' })
      })
      setInputError(error.response.data.error)
    }
  }
  const inputsAlerts = (strings: any) => {
    return inputError?.some((elemento: any) => strings?.includes(elemento))
  }
  return (
    <div className={styles.registerCompanyContainer}>
      <main>
        <Form
          onFinish={createCompany}
          form={form}
          layout="vertical"
          style={{ width: '100%' }}
        >
          <Form.Item
            validateStatus={
              inputsAlerts(['Por favor, preencha o campo Nome da Empresa.'])
                ? 'error'
                : undefined
            }
            name="name"
            label="Nome da Empresa"
            tooltip="Este campo é obrigatório"
            help={
              inputsAlerts(['Por favor, preencha o campo Nome da Empresa.'])
                ? '* Por favor, preencha este campo'
                : ''
            }
          >
            <Input
              placeholder="Nome da Empresa"
              autoComplete="off"
              size="large"
              suffix={
                inputsAlerts([
                  'Por favor, preencha o campo Nome da Empresa.',
                ]) ? (
                  <ExclamationCircleOutlined />
                ) : undefined
              }
            />
          </Form.Item>
          <Form.Item
            validateStatus={
              inputsAlerts([
                'Por favor, preencha o campo CNPJ.',
                'Por favor, insira um CNPJ válido.',
                'Já existe uma empresa cadastrada com esse CNPJ.',
              ])
                ? 'error'
                : undefined
            }
            name="cnpj"
            label="CNPJ"
            tooltip="Este campo é obrigatório"
            help={
              inputsAlerts([
                'Por favor, preencha o campo CNPJ.',
                'Por favor, insira um CNPJ válido.',
                'Já existe uma empresa cadastrada com esse CNPJ.',
              ])
                ? inputsAlerts([
                    'Por favor, insira um CNPJ válido.',
                    'Já existe uma empresa cadastrada com esse CNPJ.',
                  ])
                  ? '* Por favor, corrija este campo.'
                  : '* Por favor, preencha este campo.'
                : ''
            }
          >
            <InputMask mask="99.999.999/9999-99" maskChar="">
              {/* @ts-ignore: Unreachable code error */}
              {(inputProps: any) => (
                <Input
                  style={{ maxWidth: '320px' }}
                  placeholder="CNPJ"
                  autoComplete="off"
                  size="large"
                  suffix={
                    inputsAlerts([
                      'Por favor, preencha o campo CNPJ.',
                      'Por favor, insira um CNPJ válido.',
                      'Já existe uma empresa cadastrada com esse CNPJ.',
                    ]) ? (
                      <ExclamationCircleOutlined />
                    ) : undefined
                  }
                />
              )}
            </InputMask>
          </Form.Item>
          <Form.Item
            validateStatus={
              inputsAlerts(['Por favor, selecione os Setores.'])
                ? 'error'
                : undefined
            }
            label="Setores"
            tooltip="Este campo é obrigatório"
            name="sectors"
            help={
              inputsAlerts(['Por favor, selecione os Setores.'])
                ? '* Por favor, selecione as opções'
                : undefined
            }
          >
            <Select
              suffixIcon={
                inputsAlerts(['Por favor, selecione os Setores.']) ? (
                  <ExclamationCircleOutlined className="text-red-600" />
                ) : undefined
              }
              mode="multiple"
              placeholder="Setores"
              value={sectorsSelected}
              onChange={setSectorsSelected}
              style={{
                width: '100%',
                zIndex: 9999,
              }}
              showSearch={false}
              options={
                typeof allSectors !== 'undefined' &&
                allSectors.map((item: any) => ({
                  value: item.id,
                  label: item.name,
                }))
              }
              size="large"
              dropdownStyle={{ zIndex: 9999 }}
            />
          </Form.Item>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="large" htmlType="submit">
              CADASTRAR
            </Button>
          </Form.Item>
        </Form>
      </main>
      {contextHolder}
    </div>
  )
}
