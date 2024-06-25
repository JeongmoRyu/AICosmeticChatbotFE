import Select from 'components/Select';
import { chatBuilderState, chatBuilderGptEngine as useChatBuilderGptEngine } from 'store/ai';
import { GPT_MODEL_TYPE } from 'data/options';
import { useRecoilState } from 'recoil';

export default function Instructions() {
  const [chatGptEngine, setChatGptEngine] = useRecoilState(useChatBuilderGptEngine);
  const [chatBuilder, setChatBuilder] = useRecoilState(chatBuilderState);

  const handleSelectModel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentValue = e.currentTarget.dataset.value;
    console.log(currentValue);
    if (currentValue) {
      setChatGptEngine(currentValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setChatBuilder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <ul className='mt-1 w-full'>
        <li className='mt-1'>
          <span>Model</span>
          <div className='w-fit relative mt-4'>
            <Select
              defaultValue={chatGptEngine === 'chatgpt35' ? 'GPT-3.5' : 'GPT-4'}
              defaultLabel={chatGptEngine === 'chatgpt35' ? 'GPT-3.5' : 'GPT-4'}
              typeList={GPT_MODEL_TYPE}
              onClick={handleSelectModel}
            />
          </div>
        </li>
        <li className='mt-1'>
          <span>Name</span>
          <div className='w-full relative mt-4'>
            <textarea
              id='Instructions'
              name='Instructions'
              placeholder=''
              value={chatBuilder.name}
              maxLength={100}
              className='w-[100%] h-[100%]'
              onChange={handleChange}
            />
          </div>
        </li>
        <li className='mt-1'>
          <span>Description</span>
          <div className='w-full relative mt-4'>
            <textarea
              id='Instructions'
              name='Instructions'
              placeholder=''
              value={chatBuilder.description}
              maxLength={1000}
              className='w-[100%] h-[100%]'
              onChange={handleChange}
            />
          </div>
        </li>
        <li className='mt-1'>
          <span>Instructions</span>
          <div className='w-full h-[10rem] relative mt-4'>
            <textarea
              id='Instructions'
              name='Instructions'
              placeholder=''
              value={chatBuilder.instructions}
              maxLength={1000}
              className='w-[100%] h-[100%]'
              onChange={handleChange}
            />
          </div>
        </li>
      </ul>
    </>
  );
}
