export default function AddActions() {
  return (
    <>
      <ul className='mt-1 w-full'>
        <li className='mt-1'>
          <span>Add Actions</span>
          <button className='flex items-center justify-center font-bold w-[138px] h-[54px] rounded-lg text-gray-500 bg-[#fff]'>
            Add Actions
          </button>
        </li>
        <li className='mt-1 ml-[3rem]'>
          <span>Authentication</span>
          <textarea
            id='Authentication'
            name='Authentication'
            placeholder=''
            // value=''
            maxLength={1000}
            className='w-[100%] h-[100%]'
          />
        </li>
        <li className='mt-1 ml-[3rem]'>
          <span>Schema</span>
          <textarea
            id='Schema'
            name='Schema'
            placeholder=''
            // value=''
            maxLength={1000}
            className='w-[100%] h-[100%]'
          />
        </li>
        <li className='mt-1 ml-[3rem]'>
          <span>Available actions</span>
          <textarea
            id='AvailableActions'
            name='AvailableActions'
            placeholder=''
            // value=''
            maxLength={100}
            className='w-[100%] h-[100%]'
          />
        </li>
        <li className='mt-1 ml-[3rem]'>
          <span>Privacy policy</span>
          <textarea
            id='PrivacyPolicy'
            name='PrivacyPolicy'
            placeholder='https://api.exmple=weather-app.com'
            // value=''
            maxLength={100}
            className='w-[100%] h-[100%]'
          />
        </li>
      </ul>
    </>
  );
}
