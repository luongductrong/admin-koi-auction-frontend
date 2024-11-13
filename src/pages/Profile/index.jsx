import React, { useEffect, useState } from 'react';
import { Button, Input, Select, message, notification } from 'antd';
import styles from './index.module.scss';
import api from '../../configs';
import { useTranslation } from 'react-i18next';
import { addressApi } from '../../configs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import PasswordChangeDrawer from './../../components/PasswordChangeDrawer';

const { Option } = Select;

const Profile = () => {
  const { t } = useTranslation();
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editableDetails, setEditableDetails] = useState({
    fullName: '',
    userName: '',
    phoneNumber: '',
    province: '',
    district: '',
    ward: '',
    address: '',
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isFormModified, setIsFormModified] = useState(false);

  // Fetch user profile and provinces
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await api.get('/user/get-profile');
        const userData = res.data;

        let province = '';
        let district = '';
        let ward = '';
        let specificAddress = '';

        // Parse address from the response
        if (userData.address) {
          try {
            const parsedAddress = JSON.parse(userData.address);
            province = parsedAddress.province || '';
            district = parsedAddress.district || '';
            ward = parsedAddress.ward || '';
            specificAddress = parsedAddress.address || '';
          } catch (error) {
            console.error('Error parsing address:', error);
          }
        }

        setUserDetails({
          ...userData,
          province,
          district,
          ward,
          specificAddress,
        });

        setEditableDetails({
          fullName: userData.fullName || '',
          userName: userData.userName || '',
          phoneNumber: userData.phoneNumber || '',
          province,
          district,
          ward,
          address: specificAddress,
        });
      } catch (error) {
        message.error('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    const fetchProvinces = async () => {
      try {
        const res = await addressApi.get('/1/0.htm'); // Fetch provinces
        setProvinces(res.data.data);
      } catch (error) {
        message.error('Failed to fetch provinces');
      }
    };

    fetchUserDetails();
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  const fetchDistricts = async (provinceId) => {
    try {
      const res = await addressApi.get(`/2/${provinceId}.htm`);
      setDistricts(res.data.data);
    } catch (error) {
      message.error('Failed to fetch districts');
    }
  };

  // Fetch wards when district changes
  const fetchWards = async (districtId) => {
    try {
      const res = await addressApi.get(`/3/${districtId}.htm`);
      setWards(res.data.data);
    } catch (error) {
      message.error('Failed to fetch wards');
    }
  };

  const handleProvinceChange = (provinceId, option) => {
    setEditableDetails((prevState) => ({
      ...prevState,
      province: option.children, // Save province name, not ID
      district: '', // Reset district when province changes
    }));
    fetchDistricts(provinceId); // Load districts for the selected province
  };

  const handleDistrictChange = (districtId, option) => {
    setEditableDetails((prevState) => ({
      ...prevState,
      district: option.children, // Lưu tên district
      ward: '', // Đặt lại ward khi district thay đổi
    }));
    fetchWards(districtId); // Gọi hàm để lấy danh sách wards
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setIsFormModified(true);
  };

  // Show notification function
  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  // Save updated profile
  const handleSaveChanges = async () => {
    const fullAddress = JSON.stringify({
      province: editableDetails.province,
      district: editableDetails.district,
      ward: editableDetails.ward,
      address: editableDetails.address,
    });

    const updateData = {
      userName: editableDetails.userName,
      fullName: editableDetails.fullName,
      phoneNumber: editableDetails.phoneNumber,
      address: fullAddress, // Send address as a JSON string
    };

    try {
      const res = await api.put('/user/profile', updateData);
      openNotification('success', 'Update Successful', 'Your profile has been updated successfully.');
    } catch (error) {
      console.log('Error saving changes:', error);
      openNotification('error', 'Update Failed', 'There was an error while updating your profile.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainBody}>
        <div className={styles.row}>
          <div className={styles.colLg4}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <div className={styles.profileSection}>
                  <img
                    src={userDetails.role === 'Admin' ? 'src/assets/adminAvt.png' : 'src/assets/staffAvt.png'}
                    alt="Avatar"
                    className={styles.profileImage}
                  />
                  <div className={styles.profileInfo}>
                    {userDetails.role === 'Admin' && (
                      <FontAwesomeIcon icon={faCheckCircle} className={styles.blueTick} />
                    )}
                    <h2 className={styles.profileName}>{userDetails.fullName}</h2>
                    <div className={styles.changePassword}>
                      <Button onClick={() => setIsDrawerOpen(true)} type="primary">
                        {t('page.profile.change_password')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.readOnlySection}>
              <FormField label={t('page.profile.role')} value={userDetails.role} readOnly={true} />
              <FormField label={t('page.profile.email')} value={userDetails.email} readOnly={true} />
              <FormField
                label={t('page.profile.created_at')}
                value={userDetails.createAt ? new Date(userDetails.createAt).toLocaleString() : 'N/A'}
                readOnly={true}
              />
            </div>
          </div>
          <div className={styles.colLg8}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <FormField
                  label={t('page.profile.full_name')}
                  name="fullName"
                  value={editableDetails.fullName}
                  onChange={handleInputChange}
                  readOnly={false}
                />
                <FormField
                  label={t('page.profile.username')}
                  name="userName"
                  value={editableDetails.userName}
                  onChange={handleInputChange}
                  readOnly={false}
                />
                <FormField
                  label={t('page.profile.phone')}
                  name="phoneNumber"
                  value={editableDetails.phoneNumber}
                  onChange={handleInputChange}
                  readOnly={false}
                />

                {/* Dropdown Tỉnh */}
                <div className={styles.rowMb3}>
                  <div className={styles.colSm3}>
                    <h6 className={`${styles.mb0} ${styles.largeLabel}`}>{t('page.profile.province')}</h6>
                  </div>
                  <div className={styles.colSm9}>
                    <Select
                      value={editableDetails.province || 'default'}
                      onChange={handleProvinceChange}
                      style={{ width: '100%' }}
                    >
                      <Option value="default" disabled>
                        {t('page.profile.select_province')}
                      </Option>
                      {provinces.map((province) => (
                        <Option key={province.id} value={province.id}>
                          {province.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Dropdown Quận/Huyện */}
                <div className={styles.rowMb3}>
                  <div className={styles.colSm3}>
                    <h6 className={`${styles.mb0} ${styles.largeLabel}`}>{t('page.profile.district')}</h6>
                  </div>
                  <div className={styles.colSm9}>
                    <Select
                      value={editableDetails.district || 'default'}
                      onChange={handleDistrictChange}
                      style={{ width: '100%' }}
                      disabled={!editableDetails.province}
                    >
                      <Option value="default" disabled>
                        {t('page.profile.select_district')}
                      </Option>
                      {districts.map((district) => (
                        <Option key={district.id} value={district.id}>
                          {district.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Dropdown Ward */}
                <div className={styles.rowMb3}>
                  <div className={styles.colSm3}>
                    <h6 className={`${styles.mb0} ${styles.largeLabel}`}>{t('page.profile.ward')}</h6>
                  </div>
                  <div className={styles.colSm9}>
                    <Select
                      value={editableDetails.ward || 'default'}
                      onChange={(value) => setEditableDetails((prevState) => ({ ...prevState, ward: value }))}
                      style={{ width: '100%' }}
                      disabled={!editableDetails.district}
                    >
                      <Option value="default" disabled>
                        {t('page.profile.select_ward')}
                      </Option>
                      {wards.map((ward) => (
                        <Option key={ward.id} value={ward.id}>
                          {ward.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Specific Address */}
                <FormField
                  label={t('page.profile.specific_address')}
                  name="address"
                  value={editableDetails.address}
                  onChange={handleInputChange}
                  readOnly={false}
                />
              </div>

              <div className={styles.row}>
                <Button
                  className={styles.saveButton}
                  onClick={handleSaveChanges}
                  type="primary"
                  disabled={!isFormModified}
                >
                  {t('page.profile.save_changes')}
                </Button>
              </div>
            </div>
          </div>
          <PasswordChangeDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, name, value, onChange, readOnly }) => (
  <div className={styles.rowMb3}>
    <div className={styles.colSm3}>
      <h6 className={`${styles.mb0} ${styles.largeLabel}`}>{label}</h6>
    </div>
    <div className={styles.colSm9}>
      {readOnly ? <Input value={value} readOnly /> : <Input name={name} value={value} onChange={onChange} />}
    </div>
  </div>
);

export default Profile;
