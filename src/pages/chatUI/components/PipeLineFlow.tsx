import { useState } from 'react';
import PipeLineTab from './PipeLineTab';
import StreamPipeLine from './StreamPipeLine';
import SettingTab from './SettingTab';

function PipeLineFlow({ activeTab, setActiveTab, handleSideBar, logData }) {
  return (
    <>
      <PipeLineTab activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='w-full h-[calc(100%-40px-49px)] overflow-y-auto border border-[#d0d9e3] px-7 py-3'>
        {activeTab === 'setting' && <SettingTab handleSideBar={handleSideBar} />}
        {activeTab === 'testlog' && <StreamPipeLine logData={logData} />}
      </div>
    </>
  );
}

export default PipeLineFlow;
