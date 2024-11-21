import React, { useState } from 'react';
import { Popover, List, Spin, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import api from '../../configs';
import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';

const defaultImage = '/src/assets/defaultKoi.jpg';

const FishPopover = ({ fishIds, children }) => {
  const { t } = useTranslation();
  const [fishData, setFishData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchFishData = async () => {
    if (!fishData) {
      setLoading(true);
      try {
        const fishDetails = await Promise.all(
          fishIds.map(async (fishId) => {
            const res = await api.get(`/koi-fish/${fishId}`);
            return res.data;
          }),
        );
        setFishData(fishDetails);
      } catch (error) {
        setFishData(t('component.popover.fetch_data_failed'));
        console.error('Failed to fetch fish data', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNextFish = () => {
    if (currentIndex < fishData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevFish = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const content = fishData ? (
    <div className={styles.fishPopoverContent}>
      {fishData.length > 1 && (
        <div className={styles.navigationButtons}>
          <Button
            icon={<LeftOutlined />}
            onClick={handlePrevFish}
            disabled={currentIndex === 0}
            className={styles.button}
          />
          <Button
            icon={<RightOutlined />}
            onClick={handleNextFish}
            disabled={currentIndex === fishData.length - 1}
            className={`${styles.button} ${styles.buttonRight}`}
          />
        </div>
      )}

      {/* images */}
      {fishData[currentIndex].mediaList?.[0]?.url ? (
        <div className={styles.imageContainer}>
          <img
            src={fishData[currentIndex].mediaList[1].url}
            alt={fishData[currentIndex].koiName}
            className={styles.image}
            onError={(e) => (e.target.src = defaultImage)}
          />
        </div>
      ) : (
        <div className={styles.defaultImageContainer}>
          <img src={defaultImage} alt="default koi" className={styles.image} />
        </div>
      )}

      <List.Item>
        <List.Item.Meta
          title={<b>{fishData[currentIndex].koiName || t('component.popover.unknow_name')}</b>}
          description={
            <div className={styles.listDescription}>
              <p>
                <b>{t('component.popover.id')}:</b> {fishData[currentIndex].koiId}
              </p>
              <p>
                <b>{t('component.popover.type')}:</b> {fishData[currentIndex].koiTypeName}
              </p>
              <p>
                <b>{t('component.popover.country')}:</b> {fishData[currentIndex].koiOriginName}
              </p>
              <p>
                <b>{t('component.popover.weight')}:</b> {fishData[currentIndex].weight} kg
              </p>
              <p>
                <b>{t('component.popover.sex')}:</b> {fishData[currentIndex].sex}
              </p>
              <p>
                <b>{t('component.popover.length')}:</b> {fishData[currentIndex].length} cm
              </p>
              <p>
                <b>{t('component.popover.description')}:</b> {fishData[currentIndex].description}
              </p>
            </div>
          }
        />
      </List.Item>
    </div>
  ) : loading ? (
    <Spin />
  ) : (
    t('component.popover.no_data')
  );

  return (
    <Popover
      content={content}
      placement="right"
      trigger="click"
      overlayStyle={{ maxWidth: '400px' }}
      onClick={fetchFishData}
    >
      <span style={{ cursor: 'pointer' }}>{children}</span>
    </Popover>
  );
};

export default FishPopover;
