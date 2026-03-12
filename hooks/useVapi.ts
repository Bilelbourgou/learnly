import { DEFAULT_VOICE } from "@/lib/constants";
import { IBook, Messages } from "@/types";
import {useAuth} from "@clerk/nextjs"
import {useEffect, useRef, useState} from "react"

export type CallStatus = "idle" | "connecting" | "starting" | "listening" | "thinking" | "speaking" ;


const useLatestRef = <T>(value: T) => {
    const ref = useRef<T>(value);
    useEffect(()=> {
        ref.current = value;
    }, [value]);

    return ref;
}


export const useVapi = (book:IBook) => {

    const {userId} = useAuth()
    // TODO: Implement limits


    const [status, setStatus] = useState<CallStatus>("idle");
    const [messages, setMessages] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const  [currentUserMessage, setCurrentUserMessage] = useState<string>("");
    const [duration, setDuration] = useState<number>(0);
    const [limitError, setLimitError] = useState<string | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimerRef = useRef<NodeJS.Timeout | null>(null);
    const sessionIdRef = useRef<string | null>(null);
    const isStoppingRef = useRef<boolean>(false);

    const bookRef = useLatestRef(book);
    const durationRef = useLatestRef(duration);
    const voice = book.persona || DEFAULT_VOICE;

    const isActive = status === "starting" || status === "listening" || status === "thinking" || status === "speaking";
    
    
    //* Limits:
    // const maxDurationRef = useLatestRef(limits.maxSessionMinutes * 60);
    // const maxDurationSeconds
    //const remainingSeconds
    //const showTimeWarning

    const start = async ()=> {}
    const stop = async ()=> {}
    const clearErrors = () => {}


    return {
        status,
        isActive,
        messages,
        currentMessage,
        currentUserMessage,
        duration,
        start,
        stop,
        clearErrors,
        //maxDurationSeconds,
        //remainingSeconds,
        //showTimeWarning,
        
    }


}

export default useVapi;
    
