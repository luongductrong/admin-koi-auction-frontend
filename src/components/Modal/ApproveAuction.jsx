import React from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';

const ApproveAuction = ({ visible, onApprove, onReject, onCancel, auction }) => {
  const { t } = useTranslation();
  const auctionData = auction && auction.auction ? auction.auction : null;

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="approve" type="primary" onClick={() => onApprove('approve')}>
          {t('component.modal.approve')}
        </Button>,
        <Button key="reject" type="danger" onClick={() => onReject('reject')}>
          {t('component.modal.reject')}
        </Button>,
      ]}
    >
      {auctionData ? (
        <div>
          <p>
            <strong>{t('component.modal.fish_id')}: </strong> {auctionData.id}
          </p>
          <p>
            <strong>{t('component.modal.breeder_id')}:</strong> {auctionData.breederID}
          </p>
          <p>
            <strong>{t('component.modal.starting_price')}:</strong> {auctionData.startingPrice}
          </p>
          <p>
            <strong>{t('component.modal.buyout_price')}:</strong> {auctionData.buyoutPrice}
          </p>
          <p>
            <strong>{t('component.modal.bid_step')}:</strong> {auctionData.bidStep}
          </p>

          <p>{t('component.modal.confirm_approve_auction_message')}</p>
        </div>
      ) : (
        <p>{t('component.modal.no_data')}</p>
      )}
    </Modal>
  );
};

export default ApproveAuction;
