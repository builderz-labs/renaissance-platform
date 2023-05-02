import { CheckIcon, HandThumbUpIcon, UserIcon } from '@heroicons/react/20/solid'

const timeline = [
    {
        id: 1,
        content: 'redeemed',
        target: 'Front End Developer',
        href: '#',
        date: 'Sep 20',
        datetime: '2020-09-20',
        icon: <img src="/img/crown.png" alt="First Place" className="crown-logo" />,
        iconBackground: 'bg-black',
    },
    {
        id: 2,
        content: 'redeemed',
        amount: "2",
        target: 'Bethany Blake',
        href: '#',
        date: 'Sep 22',
        datetime: '2020-09-22',
        icon: <img src="/img/crown.png" alt="First Place" className="crown-logo" />,
        iconBackground: 'bg-black',
    },
    {
        id: 3,
        content: 'redeemed',
        target: 'Martha Gardner',
        amount: "2",

        href: '#',
        date: 'Sep 28',
        datetime: '2020-09-28',
        icon: <img src="/img/crown.png" alt="First Place" className="crown-logo" />,
        iconBackground: 'bg-black',
    },
    {
        id: 4,
        content: 'redeemed',
        amount: "2",

        target: 'Bethany Blake',
        href: '#',
        date: 'Sep 30',
        datetime: '2020-09-30',
        icon: <img src="/img/crown.png" alt="First Place" className="crown-logo" />,
        iconBackground: 'bg-black',
    },
    {
        id: 5,
        content: 'redeemed',
        amount: "2",

        target: 'Katherine Snyder',
        href: '#',
        date: 'Oct 4',
        datetime: '2020-10-04',
        icon: <img src="/img/crown.png" alt="First Place" className="crown-logo" />,
        iconBackground: 'bg-black',
    },
]

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Feed() {
    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {timeline.map((event, eventIdx) => (
                    <li key={event.id}>
                        <div className="relative pb-8">
                            {eventIdx !== timeline.length - 1 ? (
                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-8">
                                <div>
                                    <span
                                        className={classNames(
                                            event.iconBackground,
                                            'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-gray-800'
                                        )}
                                    >
                                        <img src="/img/crown.png" alt="First Place" className="crown-logo" />
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div className='flex flex-row items-center justify-center gap-5'>
                                        <p>{event.target}</p>
                                        <p className="text-sm text-gray-500">
                                            {event.content}
                                        </p>
                                        <div className='flex flex-row items-center justify-end gap-2'>
                                            <p>{event.amount}</p>
                                            <img src="/img/sol.svg" alt="solana logo" className="w-[7px]" />
                                        </div>
                                    </div>
                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                        <time dateTime={event.datetime}>{event.date}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
