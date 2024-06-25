function Card({ img = '', title = '', text = '', onClick, isDisabled }: ICardProps) {
  return (
    <div
      className={`w-[16rem] rounded overflow-hidden ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} bg-slate-100 transition duration-200 transform hover:-translate-y-1 `}
      onClick={onClick}
      style={isDisabled ? {pointerEvents: 'none'}: {}}
    >
      <div className='overflow-hidden rounded-xl'>
        <img className='w-full h-full object-cover' src={img} alt={title} />
      </div>
      <div className='mb-5'></div>
      <div className='p-4 border bg-white border-bd-gray03 rounded-3xl'>
        <h1 className='text-base font-semibold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap text-center'>
          {title}
        </h1>
        <p className='text-primary-default text-base font-normal text-center'>{text}</p>
      </div>
    </div>
  );
}

export default Card;
