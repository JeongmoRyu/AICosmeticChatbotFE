import PipeLineFlow from './PipeLineFlow';

export default function Sidebar({ activeTab, onChangeTab, sidebarState, handleSideBar, logData }) {
  return (
    <div className={`sidebar ${sidebarState && 'open'}`}>
      <div className='sidebar_head'>
        <h2 className='title'>Edit Chatbot</h2>
        <button onClick={() => handleSideBar(false)} className='btn_close'>
          닫기
        </button>
      </div>
      {sidebarState && <PipeLineFlow logData={logData} activeTab={activeTab} onChangeTab={onChangeTab} />}
    </div>
  );
}
