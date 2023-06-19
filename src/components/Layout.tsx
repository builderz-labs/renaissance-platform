import { Outlet } from "react-router-dom";
import PoweredBy from "./PoweredBy";
import AppBar from "./AppBar";
import styled from "styled-components";

const OrangeBlur = styled.div`
  position: absolute;
  z-index: -1;
  width: 664px;
  height: 664px;
  left: 628px;
  top: -542px;

  background: linear-gradient(180deg, #fc9f62 0%, #ff7a00 100%);
  opacity: 0.3;
  filter: blur(300px);
`;

const Grider = styled.div`
  position: absolute;
  top: 0;
  width: 65%;
  height: 100%;
  z-index: -1;
  background-image: url("/img/grid.svg");
  opacity: 0.4;
`;

export function Layout() {
  return (
    <div className="h-screen w-screen max-w-7xl mx-auto  flex flex-col px-4  lg:px-8">
      <Grider className="-z-10" />
      <OrangeBlur className="-z-10" />
      <AppBar />
      <main className="flex-1  text-white">
        <Outlet />
      </main>
      <PoweredBy />
    </div>
  );
}
