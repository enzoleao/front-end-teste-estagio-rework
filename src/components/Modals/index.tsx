import api from '@/service/api'
import InputMask from 'react-input-mask'
import { useEffect, useState } from 'react'
import { useAllContexts } from '@/contexts/useContexts'
import { Button, Form, Input, Modal, Select } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
export function EditModal(props: any) {
  const [form] = Form.useForm()
  const { allSectors, setAllCompanies, allCompanies, successAlert } =
    useAllContexts()
  const [sectorsSelected, setSectorsSelected] = useState<any>()
  const [inputsError, setInputsError] = useState<any>()
  const handleCancel = () => {
    form.resetFields()
    props.setIsModalOpen(false)
    setInputsError([])
  }
  useEffect(() => {
    form.setFieldsValue(props.rowData)
  }, [props.rowData, form, allCompanies])

  const handleEditCompany = async (data: any) => {
    setInputsError([])
    try {
      await api.put(`/companies/${props.rowData.id}`, data)
      const indice = allCompanies.findIndex(
        (obj: any) => obj.id === props.rowData.id,
      )
      if (indice !== -1) {
        const objetoAtualizadoCopia = {
          id: props.rowData.id,
          name: data.name,
          cnpj: data.cnpj,
          sectors: allSectors.filter((obj: any) =>
            data.sectors.includes(obj.id),
          ),
        }
        const newAllCompanies = [...allCompanies]
        newAllCompanies[indice] = objetoAtualizadoCopia
        setAllCompanies(newAllCompanies)
      }
      props.setIsModalOpen(false)
      successAlert({ content: 'Atualizado com sucesso', type: 'success' })
    } catch (err: any) {
      console.log(err)
      setInputsError(err.response.data.error)
      err.response.data.error.map((i: any) => {
        return successAlert({ content: i, type: 'error' })
      })
    }
  }
  const inputsAlerts = (strings: any) => {
    return inputsError?.some((elemento: any) => strings?.includes(elemento))
  }
  return (
    <Modal
      title="Edição de Empresa"
      footer={null}
      open={props.isModalOpen}
      onCancel={handleCancel}
      afterClose={handleCancel}
    >
      <Form
        onFinish={handleEditCompany}
        form={form}
        initialValues={props.rowData}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Nome da Empresa"
          tooltip="Este campo é obrigatório"
          validateStatus={
            inputsAlerts('Por favor, preencha o campo Nome da Empresa.')
              ? 'error'
              : undefined
          }
          help={
            inputsAlerts('Por favor, preencha o campo Nome da Empresa.')
              ? '* Por favor, preencha este campo'
              : undefined
          }
        >
          <Input
            suffix={
              inputsAlerts('Por favor, preencha o campo Nome da Empresa.') ? (
                <ExclamationCircleOutlined />
              ) : undefined
            }
            autoComplete="off"
            size="large"
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
                suffix={
                  inputsAlerts([
                    'Por favor, preencha o campo CNPJ.',
                    'Por favor, insira um CNPJ válido.',
                    'Já existe uma empresa cadastrada com esse CNPJ.',
                  ]) ? (
                    <ExclamationCircleOutlined />
                  ) : undefined
                }
                autoComplete="off"
                size="large"
              />
            )}
          </InputMask>
        </Form.Item>
        <Form.Item
          label="Setores"
          tooltip="Este campo é obrigatório"
          name="sectors"
          validateStatus={
            inputsAlerts('Por favor, selecione os Setores.')
              ? 'error'
              : undefined
          }
          help={
            inputsAlerts('Por favor, selecione os Setores.')
              ? '* Por favor, preencha este campo.'
              : undefined
          }
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
            suffixIcon={
              inputsAlerts('Por favor, selecione os Setores.') ? (
                <ExclamationCircleOutlined className="text-red-600" />
              ) : undefined
            }
            options={
              typeof allSectors !== 'undefined' &&
              allSectors.map((item: any) => ({
                value: item.id,
                label: item.name,
              }))
            }
            size="large"
            dropdownStyle={{ zIndex: 9999 }}
            showSearch={false}
          />
        </Form.Item>
        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            style={{ color: '#008000', borderColor: '#008000' }}
            size="large"
            htmlType="submit"
          >
            SALVAR
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
