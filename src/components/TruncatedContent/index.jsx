import { useState } from 'react';
import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';

const TruncatedContent = ({ text, maxLength = 246 }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedText = text.length > maxLength && !isExpanded ? `${text.slice(0, maxLength)}...` : text;

  return (
    <p className={styles.content}>
      {truncatedText}{' '}
      {text.length > maxLength && (
        <span onClick={handleToggle} className={styles.readMore}>
          {isExpanded ? `${t('component.truncatedcontent.show_less')}` : `${t('component.truncatedcontent.show_more')}`}
        </span>
      )}
    </p>
  );
};

export default TruncatedContent;
