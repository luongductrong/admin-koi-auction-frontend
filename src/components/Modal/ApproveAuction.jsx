import React from 'react';
import { Modal, Button } from 'antd';

const ApproveAuction = ({ visible, onApprove, onReject, onCancel, auction }) => {
  // Kiểm tra auction có tồn tại và có thuộc tính auction không
  const auctionData = auction && auction.auction ? auction.auction : null;

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="approve" type="primary" onClick={() => onApprove('approve')}>
          Approve
        </Button>,
        <Button key="reject" type="danger" onClick={() => onReject('reject')}>
          Reject
        </Button>,
      ]}
    >
      {auctionData ? (
        <div>
          <p>
            <strong>Fish ID: </strong> {auctionData.id}
          </p>
          <p>
            <strong>Breeder ID:</strong> {auctionData.breederID}
          </p>
          <p>
            <strong>Starting Price:</strong> {auctionData.startingPrice}
          </p>
          <p>
            <strong>Buy Now Price:</strong> {auctionData.buyoutPrice}
          </p>
          <p>
            <strong>Bid Step:</strong> {auctionData.bidStep}
          </p>

          <p>Are you sure you want to approve or reject this auction?</p>
        </div>
      ) : (
        <p>No auction data available</p>
      )}
    </Modal>
  );
};

export default ApproveAuction;
