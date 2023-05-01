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
    // {
    //     name: "ZK polling for organizers",
    //     desc: "Lorem ipsum dolor sit amet consectetur. Nunc urna elementum nec at lacus vel. Risus augue posuere consectetur risus sed.",
    //     img: "https://polcxtixgqxfuvrqgthn.supabase.co/storage/v1/object/public/zulalu-images/Frame%201470.png"
    // },
    // {
    //     name: "Make me a match",
    //     desc: "Lorem ipsum dolor sit amet consectetur. Nunc urna elementum nec at lacus vel. Risus augue posuere consectetur risus sed.",
    //     img: "https://polcxtixgqxfuvrqgthn.supabase.co/storage/v1/object/public/zulalu-images/Frame%201470.png"
    // },
    // {
    //     name: "Zuzalu Yearbook",
    //     desc: "Lorem ipsum dolor sit amet consectetur. Nunc urna elementum nec at lacus vel. Risus augue posuere consectetur risus sed.",
    //     img: "https://polcxtixgqxfuvrqgthn.supabase.co/storage/v1/object/public/zulalu-images/Frame%201470.png"
    // }
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

                    <div key={index} className="flex h-[250px] flex-col shadow-md rounded-[16px]">
                        <NextImage
                            style={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}
                            src={item.img}
                            width={500}
                            height={400}
                            objectFit="cover"
                        />
                        <div className="flex flex-col p-5 gap-2 h-3/6 mb-5">
                            <h1 className="text-[18px] font-[600]">{item.name}</h1>
                            <h1 className="text-[10px] mb-10">{item.desc}</h1>
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
