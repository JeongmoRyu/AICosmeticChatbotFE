import logo from 'assets/images/logo/logo.svg';

export default function SignOut() {
  return (
    <div className='flex flex-col h-screen justify-center items-center bg-[#f4f6f8]'>
      <img className='w-96 pb-9' src={logo} alt='logo' />
      <div className='w-24 border-solid border border-slate-300 rounded-full'></div>
      <div className='text-3xl pt-9 pb-5 font-bold text-neutral-500'>AP ChatGPT</div>
      <div className='text-base text-neutral-500'>사용자 요청에 의해 로그아웃 되었습니다</div>
      <div className='text-base text-neutral-500'>로그인을 원하실 경우 AP ON에서 AP ChatGPT로 진입해주세요</div>
    </div>
  );
}
