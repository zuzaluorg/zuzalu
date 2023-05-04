import React, { Fragment, useState } from "react"
import NextImage from "next/image"
import { AiOutlineArrowRight } from "react-icons/ai"
import BaseTemplate from "../Base"

const projects = [
    {
        name: "Ruber Ducky",
        desc: "Rubber Ducky is the ultimate conversational chatbot that provides both assistance and entertainment. With its friendly and engaging personality, Rubber Ducky is always ready to help users with any questions they may have. Whether you need a quick answer or simply want to chat, Rubber Ducky is the perfect bot for you. Its accessibility and ease of use make it a valuable tool for anyone looking for a helpful and fun chatbot experience. Give Rubber Ducky a try today and see how it can enhance your online conversations!",
        img: "https://polcxtixgqxfuvrqgthn.supabase.co/storage/v1/object/public/zulalu-images/photo_2023-04-24_10-55-21.jpg",
        link: "https://t.me/rubduck_bot"
    },
    {
        name: "Zupoll",
        desc: "Zupoll is a practical platform designed for Zuzalu residents and organizers to generate and vote on polls anonymously. While only organizers can create official advisory ballots, all residents can create unofficial ones. Zupoll promotes community engagement and allows for anonymous participation. Use Zupoll to actively contribute to decisions affecting the Zuzalu community.",
        img: "https://polcxtixgqxfuvrqgthn.supabase.co/storage/v1/object/public/zulalu-images/zupoll3.jpg",
        link: "https://zupoll.org/"
    },
    {
        name: "Zucast",
        desc: "Zucast is an anonymous forum designed for the Zuzalu community. Using zero-knowledge proof from Zuzalu passports, your identity stays hidden from the server, ensuring complete privacy. Connect and share your thoughts with fellow residents while keeping your anonymity. Give Zucast a try for a secure and private social experience in Zuzalu.",
        img: "https://polcxtixgqxfuvrqgthn.supabase.co/storage/v1/object/public/zulalu-images/zucast.jpg?t=2023-05-04T15%3A33%3A57.518Z",
        link: "https://zuca.st/"
    },
    {
        name: "Zuzalu Network",
        desc: "https://zuzalu.network is an instance of a Plural Communication Channel (PCC) built by the Plurality Network. The tool is a playful first step towards decentralized agenda setting, question curation and community deliberation through collusion-resistant quadratic voting. The tool captures the intensity of individual preferences, but elevates insights shared by less affiliated members to surface issues more likely to be in the community’s interest, rather than a social cluster’s interest. To augment community deliberation, we have integrated this tool with pol.is, so talks may discover the consensus and cleave points between social groups. To learn more, please visit us.",
        img: "https://polcxtixgqxfuvrqgthn.supabase.co/storage/v1/object/public/zulalu-images/zu-network.jpg",
        link: "https://zuzalu.network/"
    }
]

const Zapps = () => (
    <BaseTemplate>
        <div className="flex flex-col px-5 md:px-10 py-5 h-full gap-5">
            <h1 className="text-[18px] font-[600]">Use your Zuzalu passport to access other community-built apps</h1>
            <div className="flex flex-row gap-5 text-[14px]">
                {/* <h1>Want to list your Zapp?</h1>
                <div className="flex items-center gap-2">
                    <h1 className="border-b border-b-[#52B5A4]">Submit a Github PR</h1>
                    <AiOutlineArrowRight color="#52B5A4" />
                </div> */}
            </div>
            <div className="flex gap-5">
                <h1 className="border-b border-b-black font-[600]">All</h1>
                {/* <h1>New</h1> */}
            </div>
            <div className="hidden md:grid grid-cols-3 w-full gap-5">
                {projects.map((item, index) => (
                    <a key={index} href={item.link} target="_blank" rel="noopener noreferrer">
                        <div key={index} className="flex flex-col shadow-md rounded-[16px] h-[300px]">
                            <div className="relative" style={{ height: "400px" }}>
                                <NextImage
                                    className="absolute inset-0 w-full h-full object-cover rounded-t-[16px]"
                                    src={item.img}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className="flex flex-col p-5 gap-2 flex-grow">
                                <h1 className="text-[18px] font-[600]">{item.name}</h1>
                                <h1 className="text-[10px]">{item.desc}</h1>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            <div className="flex md:hidden flex-col w-full gap-5">
                {projects.map((item, index) => (
                    <a key={index} href={item.link} target="_blank" rel="noopener noreferrer">
                        <NextImage src={item.img} width={900} height={500} objectFit="cover" />
                        <div className="flex flex-col p-2 gap-2 h-full mb-3">
                            <h1 className="text-[18px] font-[600]">{item.name}</h1>
                            <h1 className="text-[10px]">{item.desc}</h1>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    </BaseTemplate>
)
export default Zapps
