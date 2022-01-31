import { Modal } from "antd"
import { useDispatch, useSelector } from "react-redux"
import useApi from './hooks/useApi'
import { setContacts } from "./store/contacts/contactActions"

const DeleteContactsModal = ({ id, setModalContent }) => {
  const $api = useApi()
  const dispatch = useDispatch()
  const { items: contacts } = useSelector(state => state.contacts)

  const handleCancel = () => {
    setModalContent(false)
  }

  const handleOk = () => {
    $api.delete(`contacts/${id}`)
      .then(() => {
        dispatch(setContacts([...contacts.filter(item => item.id !== id)]))
        handleCancel()
      })
  }

  return (
    <Modal
      title='Удаление контакта'
      visible={true}
      cancelText='Отмена'
      okText='Удалить'
      onOk={handleOk}
      onCancel={handleCancel}>
      <p>Удалить контакт?</p>
    </Modal>
  )
}

export default DeleteContactsModal