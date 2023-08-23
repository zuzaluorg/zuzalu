type Props = {
    steps: number
}

const ModalSteps = ({ steps }: Props) => (
    <div className="flex justify-start gap-3 w-full my-4">
        <div className={`w-[10px] h-[10px] rounded-full ${steps >= 1 ? "bg-fora-primary" : "bg-[#D3DDDC]"}`} />
        <div className={`w-[10px] h-[10px] rounded-full ${steps >= 2 ? "bg-fora-primary" : "bg-[#D3DDDC]"}`} />
    </div>
)

export default ModalSteps
