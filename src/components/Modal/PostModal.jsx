import React from 'react';
import { Input, Upload, Modal } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const PostModal = ({ visible, onClose, onSubmit, title, setTitle, text, setText, images, setImages }) => {
  const { t } = useTranslation();
  const handleImageUpload = ({ fileList }) => {
    setImages(fileList);
  };

  return (
    <Modal title={t('component.modal.create_blog_title')} open={visible} onOk={onSubmit} onCancel={onClose}>
      <Input
        placeholder={t('component.modal.blog_title')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: '16px' }}
      />

      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder={t('component.modal.blog_content')}
      />

      <div>
        <h5>{t('component.modal.blog_preview_images')}</h5>
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
              <div style={{ marginTop: 8 }}>{t('component.modal.blog_upload')}</div>
            </div>
          )}
        </Upload>
      </div>
    </Modal>
  );
};

export default PostModal;
