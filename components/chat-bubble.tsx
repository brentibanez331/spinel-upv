import Balancer from "react-wrap-balancer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Message } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown"
import { formattedSourceText } from "@/lib/utils";
import Image from "next/image";

const wrappedText = (text: string) =>
    text.split("\n").map((line, i) => (
        <span key={i}>
            {line}
            <br />
        </span>
    ));


interface ChatBubbleProps extends Partial<Message> {
    sources: string[]
}

export function ChatBubble({
    role = "assistant",
    content,
    sources
}: ChatBubbleProps) {
    if (!content) {
        return null
    }

    const wrappedMessage = wrappedText(content);

    return (
        <div>
            <Card className="mb-2">
                <CardHeader>
                    <CardTitle
                        className={
                            role != "assistant"
                                ? "text-amber-500"
                                : "text-[#3f4ea2]"
                        }
                    >
                        {role == "assistant" ?
                            <div className="flex space-x-2 items-center">
                                <Image
                                    src="/logo.png"
                                    alt="logo"
                                    width={20}
                                    height={20}
                                />
                                <p>
                                    Gabay
                                </p>
                            </div> : 
                            <div className="flex space-x-2 items-center">
                                <Image
                                    src="/user.png"
                                    alt=""
                                    width={25}
                                    height={25} />
                                <p>You</p>
                            </div>}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <Balancer>{wrappedMessage}</Balancer>
                </CardContent>
                <CardFooter>
                    <CardDescription className="w-full">
                        {sources && sources.length ? (
                            <Accordion type="single" collapsible className="w-full">
                                {sources.map((source, index) => (
                                    <AccordionItem value={`source-${index}`} key={index}>
                                        <AccordionTrigger>{`Source ${index + 1}`}</AccordionTrigger>
                                        <AccordionContent>
                                            <ReactMarkdown >
                                                {formattedSourceText(source)}
                                            </ReactMarkdown>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : <></>}
                    </CardDescription>
                </CardFooter>
            </Card>
        </div>
    )
}

