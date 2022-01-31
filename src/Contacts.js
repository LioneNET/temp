import { Layout, Avatar, List, Input, Select, Button } from "antd"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import AddContactsModal from "./AddContactsModal"
import DeleteContactsModal from './DeleteContactsModal'
import useApi from './hooks/useApi'
import { setContacts, setContactsIsLoading } from "./store/contacts/contactActions"

const Contacts = () => {
  const $api = useApi()
  const [searchSelectValue, setSearchSelectValue] = useState('name')
  const [modalContent, setModalContent] = useState(false)
  const dispatch = useDispatch()
  const { isContactsLoading, items: contacts } = useSelector(state => state.contacts)
  const defAvatar = require('./assets/image/avatar-blank.png')
  const textPlaceholder = { name: 'имя', phone: 'номер' }
  const timer = useRef(null)

  const setSearchSelect = (value) => {
    setSearchSelectValue(value)
  }

  const handleSearch = searchText => {
    //установим задержку
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      $api.get(`contacts?${searchSelectValue}_like=${searchText}`)
        .then(res => {
          dispatch(setContacts(res.data))
        })
    }, 600)

  }

  const handleModal = (data = { name: '', phone: '' }) => {
    setModalContent(<AddContactsModal setModalContent={setModalContent} data={data} />)
  }

  const deleteModal = id => {
    setModalContent(<DeleteContactsModal setModalContent={setModalContent} id={id} />)
  }

  useEffect(() => {
    dispatch(setContactsIsLoading(true))
    $api.get('contacts')
      .then(resp => {
        dispatch(setContacts(resp.data))
      })
      .catch(err => console.error(err.response.data))
      .finally(dispatch(setContactsIsLoading(false)))
  }, [])

  return (
    <Layout className="contact-block">
      {modalContent}
      <Input.Group className="search-group">
        <Select defaultValue="name" className="select" onChange={setSearchSelect}>
          <Select.Option value="name">Имя</Select.Option>
          <Select.Option value="phone">Номер</Select.Option>
        </Select>
        <Input placeholder={`Введите ${textPlaceholder[searchSelectValue]}`} className="input" onChange={e => handleSearch(e.target.value)} />
        <Button className="add" onClick={() => handleModal()}>Добавить</Button>
      </Input.Group>
      <List
        className="demo-loadmore-list"
        loading={isContactsLoading}
        itemLayout="horizontal"
        dataSource={contacts}
        renderItem={item => (
          <List.Item
            actions={[
              <Button onClick={() => handleModal(item)}>Изменить</Button>,
              <Button onClick={() => deleteModal(item.id)}>Удалить</Button>]}
          >
            <List.Item.Meta
              avatar={<Avatar src={defAvatar} />}
              title={item.name}
              description={item.phone}
            />
          </List.Item>
        )}
      />
    </Layout>
  )
}

export default Contacts