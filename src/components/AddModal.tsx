import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { addCollection } from "../utils/collections";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";

const allowList = ["BLDRZQiqt4ESPz12L9mt4XTBjeEfjoBopGPDMA36KtuZ"];

export default function Example() {
  const { publicKey } = useWallet();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [socialsTwitter, setSocialsTwitter] = useState("");
  const [socialsDiscord, setSocialsDiscord] = useState("");
  const [website, setWebsite] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");

  const handleAddCollection = async () => {
    if (!publicKey || !file) {
      return;
    }
    console.log("Adding collection");
    setLoading(true);
    try {
      const res = await addCollection(
        publicKey.toBase58(),
        name,
        description,
        socialsTwitter,
        socialsDiscord,
        website,
        collectionAddress,
        file
      );
      toast.success("Collection added");
    } catch (error) {
      console.log(error);
      toast.error("Error adding collection");
    }

    setLoading(false);
  };

  return (
    <>
      <div>
        <div onClick={() => setOpen(true)}>
          <span className="inline-flex items-center cursor-pointer rounded-md bg-yellow-500 px-1.5 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
            Add NFT Collection
          </span>
        </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mx-auto flex items-center justify-center rounded-full ">
                      <img
                        src="/renaissance-logo.svg"
                        alt="Renaissance Logo"
                        className="w-full px-4 h-20"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-100"
                      >
                        Add NFT Collection
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {!publicKey ||
                            !allowList.includes(publicKey.toBase58())
                            ? `You're not eligible to add NFT collections. Please reach out to us!`
                            : `To add your NFT collection, please provide the following details:`}
                        </p>
                      </div>
                    </div>
                  </div>
                  {!publicKey ||
                    !allowList.includes(publicKey.toBase58()) ? null : (
                    <div>
                      {/* Name Input */}
                      <div className="my-4">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-800 text-gray-100 p-2"
                          placeholder="Enter name"
                          onChange={(event) => setName(event.target.value)}
                          value={name}
                        />
                      </div>

                      {/* Description Input */}
                      <div className="my-4">
                        <textarea
                          name="description"
                          id="description"
                          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-800 text-gray-100 p-2"
                          placeholder="Enter description"
                          onChange={(event) =>
                            setDescription(event.target.value)
                          }
                          value={description}
                        />
                      </div>

                      {/* Image Upload Input */}
                      <div className="my-4">
                        <input
                          type="file"
                          name="image"
                          id="image"
                          accept=".png"
                          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-800 text-gray-100 p-2"
                          onChange={(event) =>
                            setFile(event.target.files![0] || null)
                          }
                        />
                      </div>

                      {/* Socials Twitter Input */}
                      <div className="my-4">
                        <input
                          type="text"
                          name="socialsTwitter"
                          id="socialsTwitter"
                          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-800 text-gray-100 p-2"
                          placeholder="Enter Twitter handle"
                          onChange={(event) =>
                            setSocialsTwitter(event.target.value)
                          }
                          value={socialsTwitter}
                        />
                      </div>

                      {/* Socials Discord Input */}
                      <div className="my-4">
                        <input
                          type="text"
                          name="socialsDiscord"
                          id="socialsDiscord"
                          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-800 text-gray-100 p-2"
                          placeholder="Enter Discord handle"
                          onChange={(event) =>
                            setSocialsDiscord(event.target.value)
                          }
                          value={socialsDiscord}
                        />
                      </div>

                      {/* Website Input */}
                      <div className="my-4">
                        <input
                          type="text"
                          name="website"
                          id="website"
                          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-800 text-gray-100 p-2"
                          placeholder="Enter website URL"
                          onChange={(event) => setWebsite(event.target.value)}
                          value={website}
                        />
                      </div>

                      {/* Collection Address Input */}
                      <div className="my-4">
                        <input
                          type="text"
                          name="collectionAddress"
                          id="collectionAddress"
                          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-800 text-gray-100 p-2"
                          placeholder="Enter collection address"
                          onChange={(event) =>
                            setCollectionAddress(event.target.value)
                          }
                          value={collectionAddress}
                        />
                      </div>

                      <div className="mt-10 sm:mt-10">
                        <button
                          type="button"
                          className={`btn inline-flex w-full justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${loading && " loading"
                            }`}
                          onClick={handleAddCollection}
                          disabled={
                            name === "" ||
                            description === "" ||
                            !file ||
                            // socialsTwitter === "" ||
                            // socialsDiscord === "" ||
                            // website === "" ||
                            collectionAddress === ""
                          }
                        >
                          Submit Collection
                        </button>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
