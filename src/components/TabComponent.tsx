
import { BuildingOfficeIcon, ChartBarIcon, UserIcon, UsersIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';
import NftContent from './Tabs/NftContent';
import AnalyticsContent from './Tabs/AnalyticsContent';

const tabs = [
    { name: 'NFTs', href: '#nfts', icon: UserIcon, current: true, content: NftContent },
    { name: 'Analytics', href: '#analytics', icon: ChartBarIcon, current: false, content: AnalyticsContent },
]


function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function TabComponent({ pageCollection }: any) {

    const [activeTab, setActiveTab] = useState(tabs.find((tab) => tab.current));

    const handleTabClick = (event: any, tab: any) => {
        event.preventDefault(); // Prevent the default link behavior

        // Reset the current property for all tabs
        tabs.forEach(t => t.current = false);

        // Set the clicked tab as active
        tab.current = true;

        setActiveTab(tab);
    };;

    return (
        <div>
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    defaultValue={tabs.find((tab) => tab.current)?.name || ''}
                >
                    {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <a
                                key={tab.name}
                                href={tab.href}
                                onClick={(event) => handleTabClick(event, tab)} // Pass the event to the function
                                className={classNames(
                                    tab.current
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                    'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
                                )}
                                aria-current={tab.current ? 'page' : undefined}
                            >
                                <tab.icon
                                    className={classNames(
                                        tab.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                                        '-ml-0.5 mr-2 h-5 w-5'
                                    )}
                                    aria-hidden="true"
                                />
                                <span>{tab.name}</span>
                            </a>
                        ))}
                    </nav>
                </div>
                {activeTab && activeTab.content && <activeTab.content pageCollection={pageCollection} />}
            </div>
        </div>
    )
}
