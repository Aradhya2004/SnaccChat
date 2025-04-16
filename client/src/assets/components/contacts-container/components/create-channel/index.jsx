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
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS } from "@/utils/constants"
import { Input } from "@/assets/components/ui/input"
import { apiClient } from "@/lib/api-client"
import { useAppStore } from "@/store"
import MultipleSelector from "@/components/ui/multipleSelect"


function CreateChannel() {

    const {setSelectedChatType, setSelectedChatData, addChannel} = useAppStore(); 
    const [newChannelModel, setNewChannelModel] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
        const getData = async () => {
            const res = await apiClient.get(GET_ALL_CONTACTS, {
                withCredentials: true,
            });
            setAllContacts(res.data.contacts);
        };
        getData();
    }, [])

    const createChannel = async () => {
        try {
            if(channelName.length >= 0 && selectedContacts.length > 0){
                const res = await apiClient.post(CREATE_CHANNEL_ROUTE, {
                    name: channelName,
                    members: selectedContacts.map((contact) => contact.value),
                },
                { withCredentials: true }
            );
            if(res.status === 200){
                setChannelName("");
                setSelectedContacts([]);
                setNewChannelModel(false);
                addChannel(res.data.channel);
            }
            }
        } catch (error) {
            console.log({error});
        }
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300" onClick={() => setNewChannelModel(true)} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">Create New Channel</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new channel.</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Channel Name" className="rounded-lg bg-[#2c2e3b] border-none p-6" onChange={(e) => setChannelName(e.target.value)} value={channelName} />
                    </div>
                    <div>
                        <MultipleSelector className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                        defaultOptions = {allContacts}
                        placeholder = "Search Contacts"
                        value = {selectedContacts}
                        onChange = {setSelectedContacts}
                        emptyIndicator = {
                            <p className="text-center text-lg leading-10 text-gray-600">No results found</p>
                        }
                        />
                    </div>
                    <div>
                        <button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 p-2" onClick={createChannel}>Create Channel</button>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default CreateChannel;
