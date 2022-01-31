import { Form, Input, Modal } from "antd"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useApi from './hooks/useApi'
import { setContacts } from "./store/contacts/contactActions"

const AddContactsModal = ({ data, setModalContent }) => {
  const [contactData, setContactData] = useState({ ...data })
  const { items: contacts } = useSelector(state => state.contacts)
  const $api = useApi()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const handleCancel = () => {
    setModalContent(false)
  }

  const handleOk = () => {
    if (data.id) {
      $api.put(`contacts/${data.id}`, contactData)
        .then(() => {
          dispatch(setContacts([...contacts.map(item => item.id === data.id ? contactData : item)]))
          handleCancel()
        })
    } else {
      $api.post('contacts', contactData)
        .then(resp => {
          dispatch(setContacts([...contacts, resp.data]))
          handleCancel()
        })
    }
  }

  return (
    <Modal
      title={data.id ? 'Изменить контакт' : 'Добавить контакт'}
      visible={true}
      cancelText='Отмена'
      okText='Применить'
      onOk={form.submit}
      onCancel={handleCancel}>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleOk}
        onFinishFailed={(e) => console.error(e)}
        autoComplete="off"
      >
        <Form.Item
          label="Имя"
          name="name"
          initialValue={data.name}
          rules={[{ required: true, message: 'Введите имя!' }]}
        >
          <Input onChange={e => setContactData({ ...contactData, name: e.target.value })} />
        </Form.Item>

        <Form.Item
          label="Номер"
          name="phone"
          initialValue={data.phone}
          rules={[{ required: true, message: 'Введите номер!' }]}
        >
          <Input onChange={e => setContactData({ ...contactData, phone: e.target.value })} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddContactsModal