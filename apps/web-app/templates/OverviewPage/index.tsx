import BaseTemplate from "../Base"
import { SessionsDTO } from "../../types"

type Props = {
    sessions: SessionsDTO[]
}

const OverviewPage = ({ sessions }: Props) => {

    return (
        <BaseTemplate>
                <div className="flex flex-col min-h-[100vh] bg-fora-gray100 p-5 gap-10">
                    <h1 className="font-normal text-[32px] md:text-[52px]">Organizers Overview</h1>
                    <div className="overflow-scroll">
                        <table className="w-[600px] md:w-full p-5 text-[12px] table-fixed border-collapse border border-slate-400 p-8">
                            <thead>
                                <tr className="bg-slate-200">
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">
                                        Name
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">
                                        StartDate
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">
                                        StartTime
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">
                                        End Time
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">
                                        Location
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">
                                        Equipment
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((event, index) => (
                                    <tr key={index} className="font-light">
                                        {/* <th className="border border-slate-300 font-normal tracking-wide p-3">
                                            {event.id}
                                        </th> */}
                                        <th className="border border-slate-300 font-normal tracking-wide p-3">
                                            {event.name}
                                        </th>
                                        <th className="border border-slate-300 font-normal tracking-wide p-3">
                                            {event.startDate.toString()}
                                        </th>
                                        <th className="border border-slate-300 font-normal tracking-wide p-3">
                                            {event.startTime}
                                        </th>
                                        <th className="border border-slate-300 font-normal tracking-wide p-3">
                                            {event.end_time}
                                        </th>
                                        <th className="border border-slate-300 font-normal tracking-wide p-3">
                                            {event.location}
                                        </th>
                                        <th className="border border-slate-300 font-normal tracking-wide p-3">
                                            {event.equipment}
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
        </BaseTemplate>
    )
}

export default OverviewPage
