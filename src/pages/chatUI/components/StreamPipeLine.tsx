import 'react-loading-skeleton/dist/skeleton.css';
import { Fragment } from 'react';
import Textarea from 'components/Textarea';

export default function StreamPipeLine({ logData }) {
  return (
    <div>
      <div className={logData.logs.length > 0 ? 'hidden' : 'block'}>
        <p className='pt-20 text-text-gray text-center'>이곳에서 Pipeline flow를 확인할 수 있습니다</p>
      </div>

      <div className={`flex-col w-full h-full ${logData.logs.length > 0 ? 'flex' : 'hidden'}`}>
        <p className='text-center text-white'>총 소요시간 : {logData.total_time / 1000}초</p>

        {logData.logs &&
          logData.logs.map((logDetail, logIndex) => {
            return (
              <Fragment key={`logDetail_${logIndex}`}>
                <p className='mt-2.5 text-white'>{logDetail.diff / 1000}초</p>
                <div className='rounded-lg bg-white text-primary-default text-sm'>
                  <Textarea
                    id={`logDetail_textarea_${logIndex}`}
                    name={`logDetail_textarea_${logIndex}`}
                    value={`${String(logDetail.log.length > 200)} + ${logDetail.log}`}
                    boxClassName={`align-top px-1 py-1 bg-transparent leading-5 h-[${logDetail.log.length > 185 ? '80' : '50'}px]`}
                    readOnly
                  />
                </div>
              </Fragment>
            );
          })}
      </div>
    </div>
  );
}
