import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { showNotification } from 'utils/common-helper';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FunctionComponent, useEffect, useState } from 'react';

export const ChatMessage: React.FC<IChatMessageProps> = ({ text, type = 'NORMAL', onStreamingComplete }) => {
  const elements: React.ReactNode[] = [];
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
      <table
        className='border-collapse border border-black'
        style={{ width: '100%', borderCollapse: 'collapse' }}
        {...props}
      />
    ),
    th: ({ node, ...props }) => (
      <th className='bg-yellow-300 text-black font-bold border border-black px-3 py-2' {...props} />
    ),
    td: ({ node, ...props }) => <td className='border border-black px-3 py-2' {...props} />,
  };

  if (type === 'STREAM') {
    return (
      <div className='w-full'>
        <Markdown remarkPlugins={[remarkGfm]} components={components}>
          {displayedText.replace(/\n/g, '  \n')}
        </Markdown>
      </div>
    );
  }

  if (text) {
    const lines = text.split(/\n|₩n/);

    let isCodeBlock = false;
    let codeBlock: string[] = [];

    const handleCopy = () => {
      showNotification('코드가 복사되었습니다.', 'success');
    };

    let markdownLine = '';

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (isCodeBlock) {
          elements.push(
            <div key={`code-${elements.length}`} className='my-4 rounded-md'>
              <div
                className='flex justify-between bg-gray-500 text-white font-bold px-3 py-2'
                style={{ borderRadius: '10px 10px 0 0' }}
              >
                <div>{codeBlock[0].toUpperCase()}</div>
                <CopyToClipboard text={codeBlock.slice(1).join('\n')} onCopy={handleCopy}>
                  <div className='flex items-center cursor-pointer'>
                    <svg
                      stroke='currentColor'
                      fill='none'
                      strokeWidth='2'
                      viewBox='0 0 24 24'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='h-4 w-4 mr-1'
                      height='1em'
                      width='1em'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'></path>
                      <rect x='8' y='2' width='8' height='4' rx='1' ry='1'></rect>
                    </svg>
                    <button>Copy code</button>
                  </div>
                </CopyToClipboard>
              </div>
              <SyntaxHighlighter
                language={codeBlock[0]}
                style={dracula}
                wrapLongLines={true}
                customStyle={{ margin: 0, borderRadius: '0 0 10px 10px' }}
              >
                {codeBlock.slice(1).join('\n')}
              </SyntaxHighlighter>
            </div>,
          );
          codeBlock = [];
          isCodeBlock = false;
        } else {
          if (markdownLine !== '') {
            elements.push(
              <div key={`text-${elements.length}`} className='markdown prose mb-2'>
                <Markdown remarkPlugins={[remarkGfm]} components={components}>
                  {markdownLine.replace(/\n/g, '  \n')}
                </Markdown>
              </div>,
            );
            markdownLine = '';
          }
          isCodeBlock = true;
          codeBlock.push(line.substring(3));
        }
      } else {
        if (isCodeBlock) {
          codeBlock.push(line);
        } else {
          markdownLine += line + '  \n';
        }
      }
    }
    if (markdownLine !== '') {
      elements.push(
        <div key={`text-${elements.length}`} className='w-full'>
          <Markdown remarkPlugins={[remarkGfm]} components={components}>
            {markdownLine.replace(/\n/g, '  \n')}
          </Markdown>
        </div>,
        // <p key={`text-${elements.length}`} className='w-full' dangerouslySetInnerHTML={{ __html: markdownLine }}></p>,
      );
    }
  } else {
    elements.push(JSON.stringify(text).replace(/\n/g, ''));
  }
  return <>{elements}</>;
};
