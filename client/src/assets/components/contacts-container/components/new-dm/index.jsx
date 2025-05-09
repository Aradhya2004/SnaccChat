import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Lottie from "react-lottie"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { animationDefaultOptions } from '@/lib/utils'
import { getColor } from '@/lib/utils';
import { HOST } from "@/utils/constants"
import { Input } from "@/assets/components/ui/input"
import { apiClient } from "@/lib/api-client"
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constants"
import { Avatar, AvatarImage } from '@/assets/components/ui/avatar'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppStore } from "@/store"


function NewDM() {

    const {setSelectedChatType, setSelectedChatData} = useAppStore(); 
    const [openNewContactModel, setOpenNewContactModel] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);
    const searchContacts = async (searchTerm) => {
        try {
            // console.log(searchTerm);
            if (searchTerm.length > 0) {
                const res = await apiClient.post(
                    SEARCH_CONTACTS_ROUTES,
                    { searchTerm },
                    { withCredentials: true }
                );
                // console.log(res);
                if (res.status === 200) {
                    setSearchedContacts(res.data.contacts);
                }
                else {
                    setSearchedContacts([]);
                }
            }
        } catch (error) {
            console.error("Search Error:", error.response?.data || error.message);
        }
    };

    const selectNewContact = (contact) => {
        setOpenNewContactModel(false);
        setSelectedChatType("contact")
        setSelectedChatData(contact)
        setSearchedContacts([]);
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300" onClick={() => setOpenNewContactModel(true)} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">Select New Contact</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please select a contact</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Search Contacts" className="rounded-lg bg-[#2c2e3b] border-none" onChange={(e) => searchContacts(e.target.value)} />
                    </div>
                    <ScrollArea className="h-[250px]">
                        <div className="flex flex-col gap-5">
                            {
                                searchedContacts.map((contact) => (
                                    <div key={contact._id} className="flex gap-3 items-center cursor-pointer" onClick={() => selectNewContact(contact)}>
                                        <div className='h-12 w-12 relative'>
                                            <Avatar className='h-12 w-12 border-[1px] rounded-full overflow-hidden'>
                                                {contact.image ? (
                                                    <AvatarImage
                                                        src={`${HOST}/${contact.image}`}
                                                        alt="profile"
                                                        className="object-cover w-full h-full bg-black rounded-full"
                                                    />
                                                ) : (
                                                    <div className={`uppercase h-12 w-12 text-lg flex items-center justify-center ${getColor(contact.color)}`}>
                                                        {contact.firstName
                                                            ? contact.firstName.split("").shift()
                                                            : contact.email.split("").shift()
                                                        }
                                                    </div>
                                                )
                                                }
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span>
                                                {
                                                    contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email
                                                }
                                            </span>
                                            <span className="text-xs">{contact.email}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                    </ScrollArea>
                    {searchedContacts.length <= 0 && (
                        <div className='flex-1 md:bg-[#181920] md:flex mt-5 flex-col justify-center items-center duration-1000 transition-all'>
                            <Lottie
                                isClickToPauseDisabled={true}
                                height={100}
                                width={100}
                                options={animationDefaultOptions}
                            />
                            <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center'>
                                <h3 className='poppins-medium'>
                                    Hi<span className='text-purple-500'>! </span>
                                    Search new
                                    <span className='text-purple-500'> Contact.</span>
                                </h3>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </>
    )
}

export default NewDM
