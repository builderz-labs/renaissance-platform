import React from 'react'

function PoweredBy() {
    return (
        <div className=" fixed bottom-0 left-0 w-full">
            <div className="flex flex-row items-center justify-center gap-2 text-[18px] font-semibold py-4 bg-black w-full">
                <p>powered by</p>
                <a href="https://builderz.dev" target="_blank" rel="noreferrer">
                    <img src="/img/builderz.svg" alt="builderz logo" className='w-24' />
                </a>
            </div>
        </div>
    )
}

export default PoweredBy