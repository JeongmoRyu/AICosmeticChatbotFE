function PipeLineTab({ activeTab, setActiveTab }: TabbarProps) {
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const tabs = [
    { id: 'setting', label: 'Edit Configure' },
    { id: 'testlog', label: 'ChatLog History' },
  ];

  return (
    <div className='flex cursor-pointer'>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`h-[50px] pt-2 mb-[-1px] flex items-center relative flex-1 tab ${activeTab === tab.id && 'active'}`}
          onClick={() => handleTabClick(tab.id)}
        >
          <span className={`${activeTab === tab.id && 'font-bold'} text-white mx-auto`}>{tab.label}</span>
          <div
            className={`absolute w-full h-0.5 bottom-0 left-1/10 ${activeTab === tab.id ? 'bg-blue-500' : 'bg-[#d2dcea]'}`}
          ></div>
        </div>
      ))}
    </div>
  );
}

export default PipeLineTab;
