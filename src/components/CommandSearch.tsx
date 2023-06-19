import { Fragment, useState, useEffect, useCallback } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type Person = {
  id: number;
  name: string;
  url: string;
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const keyDownHandler = useCallback(
    (e: any) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    },
    [setOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [keyDownHandler]);

  const { data: collectionsV1 } = useQuery<any>({
    queryKey: ["collectionsV1"],
    onSuccess: () => setLoading(false),
  });

  // create a list of collections from the data
  const collections =
    collectionsV1?.data?.collections?.map((collection: any) => ({
      id: collection.id,
      name: collection.name,
      url: `/project/${collection.id}`,
    })) || [];

  const filteredPeople =
    query === ""
      ? []
      : collections.filter((collection: any) => {
          return collection.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <>
      <div className="w-full sm:max-w-xs">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <Combobox
            onChange={(collection) => {
              navigate((collection as Person).url);
              setOpen(false); // Close the modal after navigating
              setQuery(""); // Reset the query to hide the options
            }}
          >
            <div className="">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute left-4 top-1.5  h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <Combobox.Input
                className="h-8 w-full border-0 bg-gray-900 bg-opacity-40 rounded-md pl-11 pr-4 text-gray-100 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                placeholder="Search..."
                onChange={(event) => setQuery(event.target.value)}
              />
              {loading ? (
                <p className="p-4 text-sm absolute -bottom-2.5 right-4 text-gray-500 opacity-60 animate-pulse -z-10">
                  Loading collections...
                </p>
              ) : query !== "" && filteredPeople.length === 0 ? (
                <p className="p-4 text-sm absolute -bottom-2.5 right-4 text-gray-500 opacity-60">
                  No Collection found.
                </p>
              ) : null}
            </div>

            {filteredPeople.length > 0 && (
              <Combobox.Options
                static
                className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-200 absolute -bottom-12 w-full text-start"
              >
                {filteredPeople.map((collection: any) => (
                  <Combobox.Option
                    key={collection.id}
                    value={collection}
                    className={({ active }) =>
                      classNames(
                        "cursor-default select-none px-4 py-2",
                        active && "bg-black text-white"
                      )
                    }
                  >
                    {collection.name}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}

            {query !== "" && filteredPeople.length === 0 && (
              <p className="p-4 text-sm absolute -bottom-12 text-gray-500">
                No Collection found.
              </p>
            )}
          </Combobox>
        </div>
      </div>
      <Transition.Root
        show={open}
        as={Fragment}
        afterLeave={() => setQuery("")}
        appear
      >
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(!open)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-lg bg-gray-900 shadow-2xl  transition-all">
                <Combobox
                  onChange={(collection) => {
                    navigate((collection as Person).url);
                    setOpen(false); // Close the modal after navigating
                    setQuery(""); // Reset the query to hide the options
                  }}
                >
                  <div className="relative">
                    <MagnifyingGlassIcon
                      className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Combobox.Input
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-100 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Search..."
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </div>

                  {filteredPeople.length > 0 && (
                    <Combobox.Options
                      static
                      className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-200"
                    >
                      {filteredPeople.map((collection: any) => (
                        <Combobox.Option
                          key={collection.id}
                          value={collection}
                          className={({ active }) =>
                            classNames(
                              "cursor-default select-none px-4 py-2",
                              active && "bg-orange-600 text-white"
                            )
                          }
                        >
                          {collection.name}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}

                  {query !== "" && filteredPeople.length === 0 && (
                    <p className="p-4 text-sm text-gray-500">
                      No Collection found.
                    </p>
                  )}
                </Combobox>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
