import React, { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import styles from './index.module.scss';
import api from '../../configs/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await api.get('/user/get-profile', {
          requireAuth: true,
        });

        const userData = res.data;
        let decodedAddress = 'N/A';

        if (userData.address) {
          try {
            const parsedAddress = JSON.parse(userData.address);
            decodedAddress = `${parsedAddress.province}, ${parsedAddress.district}`;
          } catch (error) {
            decodedAddress = userData.address;
          }
        }

        setUserDetails({
          ...userData,
          address: decodedAddress,
        });
      } catch (error) {
        console.log('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

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
                    <h2>{userDetails.fullName}</h2>
                    <p className={styles.textSecondary}>
                      {userDetails.role === 'Admin' ? (
                        <>
                          <FontAwesomeIcon icon={faCheckCircle} className={styles.blueTick} /> Admin System
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCheckCircle} className={styles.grayTick} /> Staff managemer
                        </>
                      )}
                    </p>
                    <p className={styles.textSecondary}>{userDetails.address}</p>
                    <div className={styles.btn}>
                      <Button type="primary" className={styles.followButton}>
                        Follow
                      </Button>
                      <Button className={styles.messageButton}>Message</Button>
                    </div>
                  </div>
                </div>
                <hr className={styles.divider} />
                <ul className={styles.listGroup}>
                  <SocialLink icon="globe" title="Website" value="https://koiauction.com.vn" />
                  <SocialLink icon="github" title="Github" value="@Git" />
                  <SocialLink icon="twitter" title="Twitter" value="@Twt" />
                  <SocialLink icon="instagram" title="Instagram" value="@Ins" />
                  <SocialLink icon="facebook" title="Facebook" value="@Facebook" />
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.colLg8}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <FormField label="Full Name" value={userDetails.fullName} />
                <FormField label="Email" value={userDetails.email} />
                <FormField label="Username" value={userDetails.userName} />
                <FormField label="Phone" value={userDetails.phoneNumber} />
                <FormField label="Role" value={userDetails.role} />
                <FormField
                  label="Create At"
                  value={userDetails.createAt ? new Date(userDetails.createAt).toLocaleString() : 'N/A'}
                />
                <div className={styles.row}>
                  <Button type="primary" className={styles.saveButton}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.colSm12}>
                <div className={styles.card}>
                  <div className={styles.cardBody}>
                    <h5 className={styles.projectStatus}>Project Status</h5>
                    <ProjectStatus title="Web Design" percentage={80} color="primary" />
                    <ProjectStatus title="Website Markup" percentage={72} color="danger" />
                    <ProjectStatus title="One Page" percentage={89} color="success" />
                    <ProjectStatus title="Mobile Template" percentage={55} color="warning" />
                    <ProjectStatus title="Backend API" percentage={66} color="info" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialLink = ({ icon, title, value }) => (
  <li className={styles.listGroupItem}>
    <h6 className={styles.mb0}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${styles.feather} ${styles[`feather${icon.charAt(0).toUpperCase() + icon.slice(1)}`]}`}
      >
        {getIconPath(icon)}
      </svg>
      {title}
    </h6>
    <span className={styles.textSecondary}>{value}</span>
  </li>
);

const FormField = ({ label, value }) => (
  <div className={styles.rowMb3}>
    <div className={styles.colSm3}>
      <h6 className={`${styles.mb0} ${styles.largeLabel}`}>{label}</h6>
    </div>
    <div className={styles.colSm9}>
      <Input value={value} readOnly />
    </div>
  </div>
);

const ProjectStatus = ({ title, percentage, color }) => (
  <>
    <p>{title}</p>
    <div className={styles.progressContainer}>
      <div
        className={`${styles.progressBar} ${styles[`bg${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </>
);

const getIconPath = (icon) => {
  switch (icon) {
    case 'globe':
      return (
        <>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </>
      );
    case 'github':
      return (
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      );
    case 'twitter':
      return (
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
      );
    case 'instagram':
      return <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>;
    case 'facebook':
      return <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z"></path>;
    default:
      return null;
  }
};

export default Profile;
