import api from "@/service/api";
import InputMask from 'react-input-mask'
import { useEffect, useState } from "react";
import { useAllContexts } from "@/contexts/useContexts";
import { Button, Form, Input, Modal, Select } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;


export function DeleteModal(props:any) {
    const showDeleteConfirm = () => {
        confirm({
          title: 'Are you sure delete this task?',
          icon: <ExclamationCircleFilled />,
          content: 'Some descriptions',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            console.log('OK');
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      };

}
export function EditModal(props: any) {
    const [ form ] = Form.useForm();
    const { allSectors, setAllCompanies, allCompanies, successAlert } = useAllContexts()
    const [sectorsSelected, setSectorsSelected] = useState<any>()
    const handleCancel = () => {
        form.resetFields()
        props.setIsModalOpen(false);
      };
      useEffect(() => {
        form.setFieldsValue(props.rowData);
      }, [props.rowData, form, allCompanies]);
      
    const handleEditCompany = async (data: any) =>{
        try {
            await api.put(`/companies/${props.rowData.id}`, data)
            const indice = allCompanies.findIndex((obj: any) => obj.id === props.rowData.id)
            if (indice!== -1) {
              const objetoAtualizadoCopia = { 
                id: props.rowData.id,
                name: data.name,
                cnpj: data.cnpj,
                sectors: allSectors.filter((obj: any) => data.sectors.includes(obj.id))
               };
              const newAllCompanies = [...allCompanies];
              newAllCompanies[indice] = objetoAtualizadoCopia
              setAllCompanies(newAllCompanies);
            }
            props.setIsModalOpen(false)
            successAlert({content: 'Atualizado com sucesso', type: 'success'})
          }catch(err: any){
            successAlert({content: err.response.data.error, type: 'error'})
            console.log(err)
          }
    }
    return (
        <Modal  
            title="Edição de Empresa"
            footer={null}
            open={props.isModalOpen} 
            onCancel={handleCancel}
        >
            <Form
                onFinish={handleEditCompany}
                form={form}
                initialValues={props.rowData}
                layout="vertical"
                >
                <Form.Item name="name" label="Nome da Empresa" tooltip="Este campo é obrigatório">
                    <Input autoComplete="off" size='large'/>
                </Form.Item>
                <Form.Item name="cnpj" label="CNPJ" tooltip="Este campo é obrigatório">
                    <InputMask  mask="99.999.999/9999-99" maskChar="">
                        {/* @ts-ignore: Unreachable code error */}
                        {(inputProps: any) => <Input autoComplete="off" size='large'  />}
                    </InputMask>
                </Form.Item>
                <Form.Item label="Setores" tooltip="Este campo é obrigatório" name="sectors">
                    <Select
                        mode="multiple"
                        placeholder="Setores"
                        value={sectorsSelected}
                        defaultValue={props.rowData?.sectors.map(({ id }: any) => id)}
                        onChange={setSectorsSelected}
                        style={{
                            width: '100%',
                            zIndex: 9999,               
                        }}
                        options={
                            typeof allSectors !== 'undefined' &&
                            allSectors.map((item: any) => ({
                                value: item.id,
                                label: item.name,
                            }))
                        }
                        size='large'
                        dropdownStyle={{ zIndex: 9999 }}
                        showSearch={false}
                        />
                </Form.Item>
                <Form.Item  style={{display: 'flex', justifyContent:'flex-end'}}>
                    <Button  size="large"  htmlType="submit">SALVAR</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}