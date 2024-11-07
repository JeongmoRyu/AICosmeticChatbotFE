import { useCallback, useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { showNotification } from 'utils/common-helper';
import ico_copy from '../../../assets/images/icons/ico_copy_16.svg';

export default function StreamPipeLine({ logData }) {
  const [totalTokens, setTotalTokens] = useState<number>(0)

  const copyToClipboard = useCallback((log) => {
    navigator.clipboard
      .writeText(log)
      .then(() => {
        showNotification('로그가 클립보드에 복사되었습니다.', 'success');
      })
      .catch((err) => {
        showNotification(`로그 복사를 실패하였습니다. ${err}`, 'error');
      });
  }, []);

  useEffect(() => {
    if (logData.logs && logData.logs.length > 0) {
      const tokensSum = logData.logs
        .filter((item) => item.tokens && item.tokens !== -1)
        .reduce((sum, item) => sum + item.tokens, 0); 
      setTotalTokens(tokensSum); 
    }
  }, [logData.logs]);


  if (!logData.logs || !logData.logs.length) {
    return <p className='pt-20 text-text-gray text-center'>이곳에서 Pipeline flow를 확인할 수 있습니다</p>;
  }

  return (
    <div className='scroll_wrap test_log'>
      {logData.total_time && <strong className='total_time'>총 소요시간 : {logData.total_time / 1000}초</strong>}
      {logData.total_time && <strong className='total_time'>Total Tokens : {totalTokens}</strong>}

      {logData.logs &&
        logData.logs.map((item, index) => (
          <div className='log_box' key={`log_detail_${index}`}>
            <div className='log_box_head'>
              <p>
                <em>{item.title}</em> ({item.diff / 1000}초{item.tokens && item.tokens !== -1 && `/ tokens: ${item.tokens}`}) 
                </p>
              <button type='button' id={`copyButton_${index}`} onClick={() => copyToClipboard(item.log)}>
                copy <img src={ico_copy} alt='복사하기' />
              </button>
            </div>
            <pre>{item.log}</pre>
          </div>
        ))}
    </div>
  );
}
