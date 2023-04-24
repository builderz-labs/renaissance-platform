import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Tabs } from './Tabs';
import styled from 'styled-components';
import PoweredBy from './PoweredBy';
import AppBar from './AppBar';
import FormBanner from './FormBanner/FormBanner';

const myMain = styled.main``;

export function Layout() {
  return (
    <div className="h-screen w-screen max-w-7xl mx-auto  flex flex-col px-2 sm:px-4  lg:px-8">
      <AppBar />
      {/* <Tabs /> */}
      {/* <Header /> */}
      {/* Set background color here */}
      <main className="flex-1  text-white">
        <Outlet />
      </main>
      <PoweredBy />
    </div>
  );
}
