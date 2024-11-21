import React from 'react';
import { Input, Upload, Modal } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';

const PostModal = ({ visible, onClose, onSubmit, title, setTitle, text, setText, images, setImages }) => {
  const handleImageUpload = ({ fileList }) => {
    setImages(fileList);
  };

  return (
    <Modal title="Create a new blog" open={visible} onOk={onSubmit} onCancel={onClose}>
      {/* Title input */}
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: '16px' }}
      />

      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Write your post content..."
      />

      <div>
        <h5>Preview Images:</h5>
        <Upload
          accept="image/*"
          fileList={images}
          onChange={handleImageUpload}
          beforeUpload={() => false} // Ngăn không cho upload ngay lập tức
          listType="picture-card"
          showUploadList={{ showPreviewIcon: false }} // Ẩn biểu tượng xem trước
        >
          {images.length < 4 && (
            <div>
              <VerticalAlignTopOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </div>
    </Modal>
  );
};

export default PostModal;
