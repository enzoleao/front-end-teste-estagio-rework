import InputMask from 'react-input-mask'
import styles from './RegisterCompany.module.scss'
import api from '@/service/api'
import { useAllContexts } from '@/contexts/useContexts'
import { Button, Form, Input, Select } from 'antd'
import { useState } from 'react'

export function RegisterCompany() {
  const [form] = Form.useForm()
  const {
    allSectors,
    setAllCompanies,
    allCompanies,
    successAlert,
    contextHolder,
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
    } catch (error: any) {
      console.log(error)
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
          >
            <Input
              placeholder="Nome da Empresa"
              autoComplete="off"
              size="large"
            />
          </Form.Item>
          <Form.Item
            validateStatus={
              inputsAlerts([
                'Por favor, preencha o campo CNPJ.',
                'Por favor, insira um CNPJ válido.',
              ])
                ? 'error'
                : undefined
            }
            name="cnpj"
            label="CNPJ"
            tooltip="Este campo é obrigatório"
          >
            <InputMask mask="99.999.999/9999-99" maskChar="">
              {/* @ts-ignore: Unreachable code error */}
              {(inputProps: any) => (
                <Input
                  style={{ maxWidth: '320px' }}
                  placeholder="CNPJ"
                  autoComplete="off"
                  size="large"
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
          >
            <Select
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
