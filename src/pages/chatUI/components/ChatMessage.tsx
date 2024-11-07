import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { showNotification } from 'utils/common-helper';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FunctionComponent, useEffect, useState } from 'react';
import React from 'react';

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const handleCopy = () => {
    showNotification('코드가 복사되었습니다.', 'success');
  };

  return (
    <div className='relative my-4 rounded-md'>
      <div
        className='flex justify-between items-center bg-[#f4f6f8] text-black font-bold px-3 py-2 sticky top-0 z-10'
        style={{ borderRadius: '10px 10px 0 0' }}
      >
        <div>{language.toUpperCase()}</div>
        <CopyToClipboard text={code} onCopy={handleCopy}>
          <div className='flex items-center gap-2 bg-[#f4f6f8] hover:bg-gray-500 px-3 py-1.5 rounded cursor-pointer transition-colors'>
            <svg
              stroke='#4B5563'  // 아이콘 색상을 회색으로 변경
              fill='none'
              strokeWidth='2'
              viewBox='0 0 24 24'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='h-4 w-4'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'></path>
              <rect x='8' y='2' width='8' height='4' rx='1' ry='1'></rect>
            </svg>
            <span className='text-sm text-gray-700 font-medium whitespace-nowrap'>Copy code</span>
          </div>
        </CopyToClipboard>
      </div>
      <div className='overflow-x-auto'>
        <SyntaxHighlighter
          language={language}
          style={dracula}
          wrapLongLines={false}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 10px 10px',
            maxHeight: '500px',
            minWidth: '100%'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export const ChatMessage: React.FC<IChatMessageProps> = ({ text, type = 'NORMAL', onStreamingComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (type === 'STREAM' && currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeoutId);
    } else if (type === 'STREAM' && currentIndex >= text.length) {
      onStreamingComplete?.();
    }
  }, [currentIndex, text, type, onStreamingComplete]);

  const headerStyles: IHeaderStyles = {
    h1: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '0.5rem' },
    h2: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '0.5rem' },
    h3: { fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '0.5rem' },
    h4: { fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '0.5rem' },
    h5: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '0.5rem' },
    h6: { fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '0.5rem' },
  };

  const components: { [key: string]: FunctionComponent<IExtraProps> } = {
    // 기본 컴포넌트
    ol: ({ node, ...props }) => <ol style={{ listStyleType: 'decimal', marginLeft: '20px' }} {...props} />,
    ul: ({ node, ...props }) => <ul style={{ listStyleType: 'disc', marginLeft: '40px' }} {...props} />,
    li: ({ node, ...props }) => <li style={{ marginBottom: '5px' }} {...props} />,
    h1: ({ node, ...props }) => <h1 style={headerStyles.h1} {...props} />,
    h2: ({ node, ...props }) => <h2 style={headerStyles.h2} {...props} />,
    h3: ({ node, ...props }) => <h3 style={headerStyles.h3} {...props} />,
    h4: ({ node, ...props }) => <h4 style={headerStyles.h4} {...props} />,
    h5: ({ node, ...props }) => <h5 style={headerStyles.h5} {...props} />,
    h6: ({ node, ...props }) => <h6 style={headerStyles.h6} {...props} />,
    table: ({ node, ...props }) => (
      <table className='border-collapse border border-black w-full' {...props} />
    ),
    th: ({ node, ...props }) => (
      <th className='bg-yellow-300 text-black font-bold border border-black px-3 py-2' {...props} />
    ),
    td: ({ node, ...props }) => <td className='border border-black px-3 py-2' {...props} />,

    // 코드 관련 컴포넌트
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      if (!inline && language) {
        return (
          <CodeBlock
            language={language}
            code={String(children).replace(/\n$/, '')}
          />
        );
      }

      return (
        <code className='bg-gray-100 px-1 py-0.5 rounded font-mono text-sm' {...props}>
          {children}
        </code>
      );
    },

    pre: ({ node, children, ...props }) => {
      return <>{children}</>;
    },

    p: ({ node, children, ...props }) => {
      const hasCodeBlock = React.Children.toArray(children).some(
        child => React.isValidElement(child) && child.type === 'code' && child.props.className?.includes('language-')
      );

      if (hasCodeBlock) {
        return <>{children}</>;
      }

      return (
        <p className='whitespace-pre-wrap break-words my-2' {...props}>
          {children}
        </p>
      );
    }
  };

  if (type === 'STREAM') {
    return (
      <div className='w-full overflow-x-hidden'>
        <Markdown remarkPlugins={[remarkGfm]} components={components}>
          {displayedText.replace(/\n/g, '  \n')}
        </Markdown>
      </div>
    );
  }

  return (
    <div className='w-full overflow-x-hidden'>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {text?.replace(/\n/g, '  \n') || ''}
      </Markdown>
    </div>
  );
};