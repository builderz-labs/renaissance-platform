import React from "react";
import { DoughnutChart } from "../Charts/DoughnutChart";

function AnalyticsContent() {
  return (
    <main>
      <section>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-start justify-start text-start my-10">
          <div className="md:col-span-2 flex items-start justify-start flex-col gap-2 mb-10 w-1/2">
            <h1 className="text-4xl font-bold text-renaissance-orange">
              Collection Analytics
            </h1>
            <p>
              Here you can find analytic stats for set collection. Tracking
              Sales, Sales Volume, Outstanding & Paid Royalties as well as the
              Percentage of Paid Royalties
            </p>
          </div>
          <p>Coming Soon</p>
          {/* <div className="bg-black p-4 rounded-lg shadow-xl">LinearChart 1</div>
          <div className="bg-black p-4 rounded-lg shadow-xl">
            LinearChart 2 oder Text
          </div>
          <div className="bg-black p-4 rounded-lg shadow-xl">Analytics</div>
          <div className="bg-black p-4 rounded-lg shadow-xl">Analytics</div> */}
        </div>
      </section>
    </main>
  );
}

export default AnalyticsContent;
