import React from 'react';
import { AutoComplete } from 'antd';

const AutoCompleteComponent = ({ contacts, currChat, setCurrChat, searchValue, setSearchValue }) => {
  console.log('Render ContactAutoComplete');
  // Tạo list cho AutoComplete dựa trên searchValue
  const options = contacts
    .filter((contact) => contact.fullName.toLowerCase().includes(searchValue.toLowerCase()))
    .map((contact) => ({
      value: contact.fullName,
      label: (
        <div>
          <span>{contact.fullName}</span>
        </div>
      ),
    }));

  const handleSelect = (value) => {
    const selectedContact = contacts.find((contact) => contact.fullName === value);
    if (selectedContact) {
      setCurrChat({
        ...currChat,
        receiverName: selectedContact.fullName,
        receiverId: selectedContact.id,
      });
    }
  };

  return (
    <AutoComplete
      options={options}
      style={{ width: '100%' }}
      placeholder="Search..."
      onSelect={handleSelect}
      onSearch={setSearchValue}
      value={searchValue}
      onChange={setSearchValue}
    />
  );
};

export default React.memo(AutoCompleteComponent);
