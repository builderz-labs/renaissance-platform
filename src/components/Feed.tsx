import useRedemptionFeed from "../hooks/useRedemptionFeed";
import { truncate } from "../utils/history";
import { Loading } from "./Loading";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Feed() {
  const feed = useRedemptionFeed();

  if (feed.loading) {
    return <Loading />;
  }

  if (feed.error) {
    return <div>Error</div>;
  }

  return (
    <div className="flow-root ">
      <ul role="list" className="-mb-8">
        {feed.redemptions &&
          feed.redemptions.map((redemption, eventIdx) => (
            <li key={redemption.id}>
              <div className="relative pb-8">
                {eventIdx !== feed.redemptions.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-8">
                  <div>
                    <span
                      className={classNames(
                        <img
                          src="/img/crown.png"
                          alt="First Place"
                          className="crown-logo"
                        />,
                        "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-gray-800 "
                      )}
                    >
                      <img
                        src="/img/crown.png"
                        alt="First Place"
                        className="crown-logo"
                      />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div className="flex flex-row items-center justify-center gap-5">
                      <p>{truncate(redemption.payer, 4, 4)}</p>
                      <p className="text-sm text-gray-500">redeemed</p>
                      <div className="flex flex-row items-center justify-end gap-2">
                        <p>
                          {(redemption.amount / LAMPORTS_PER_SOL).toFixed(2)}
                        </p>
                        <img
                          src="/img/sol.svg"
                          alt="solana logo"
                          className="w-[7px]"
                        />
                      </div>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time
                        dateTime={new Date(
                          redemption.timestamp * 1000
                        ).toISOString()}
                      >
                        {new Date(
                          redemption.timestamp * 1000
                        ).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
