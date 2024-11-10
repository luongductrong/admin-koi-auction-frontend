import './index.scss';
import { ConfigProvider } from 'antd';
function GlobalStyles({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'rgb(212, 22, 60)',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default GlobalStyles;
