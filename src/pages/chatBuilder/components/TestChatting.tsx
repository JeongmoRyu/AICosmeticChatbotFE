import ico_send_on from 'assets/images/icons/ico_send_on.svg';

export default function TestChatting() {
  return (
    <>
      <div className='ml-12 mr-12 w-[90%] flex justify-center items-center h-full rounded-2xl bg-white'>
        <div className='absolute flex justify-center w-fill-available bottom-4 mx-3'>
          <div className='flex flex-col justify-center items-center w-[90%] text-sm pt-2 relative'>
            <textarea id='promptbox' className='prompt-box' placeholder={'AI Chat에게 질문 또는 요청을 해보세요'} />
            <div className='absolute right-1'>
              <button className='flex justify-center items-center w-10 h-10 rounded-lg hover:cursor-pointer bg-primary-default'>
                <img src={ico_send_on} alt='send on' className='w-10 h-10' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
