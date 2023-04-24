import { useMemo } from 'react';
import { FaChevronLeft, FaHome } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const basePaths = ['/', '/balance']; // Add more paths here if needed

const MyHeader = styled.header`
  background: linear-gradient(180deg, #060606 0%, rgba(6, 6, 6, 0) 100%);
`;

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = useMemo(() => {
    if (pathname === '/') {
      return <FaHome />;
    } else {
      const segments = pathname.split('/');
      return pathname.split('/')[segments.length - 1].replace('%20', ' ');
    }
  }, [pathname]);

  return (
    <MyHeader className="w-full h-fit  px-2 sm:px-4  lg:px-8">
      <div className="h-10 flex justify-start items-start gap-1 p-4">
        <div className="flex items-center gap-4">
          {!basePaths.some(base => pathname === base) && (
            <button onClick={() => navigate(-1)}>
              <FaChevronLeft />
            </button>
          )}
          <h1 className="text-left text-3xl inline capitalize font-bold">
            {title}
          </h1>
        </div>
      </div>
    </MyHeader>
  );
}
