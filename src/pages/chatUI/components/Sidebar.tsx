import ico_close from 'assets/images/image/close.png';
import PipeLineFlow from './PipeLineFlow';

export default function Sidebar({ activeTab, setActiveTab, SidebarState, handleSideBar, logData }) {
  return (
    <div className={`sidebar ${SidebarState && 'open'}`}>
      <div className='p-3 min-w-[450px] h-full'>
        <div className='flex flex-row justify-between'>
          <div className='flex'>
            <h2 className='text-2xl pl-3'>{activeTab} Edit Chatbot</h2>
          </div>
          <div className='flex'>
            <button onClick={handleSideBar} className='text-primary-default px-1 py-1 rounded'>
              <img src={ico_close} alt='x' className='object-scale-down w-[2rem] h-[2rem]' />
            </button>
          </div>
        </div>
        <PipeLineFlow
          handleSideBar={handleSideBar}
          logData={logData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}
