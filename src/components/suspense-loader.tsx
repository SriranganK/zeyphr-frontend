import zeyphrLogo from "../assets/images/logo.png";

const SuspenseLoader: React.FC = () => {
    return (
        <div className="pb-6 w-screen h-screen flex flex-col items-center justify-between animate-pulse">
            <div />
            <div className="flex items-center gap-2">
                <img src={zeyphrLogo} alt="Zeyphr Logo" className="size-16" />
                <p className="text-3xl font-medium">Zeyphr</p>
            </div>
            <p className="text-sm font-light text-center">Bringing Web3 to everyone</p>
        </div>
    );
};

export default SuspenseLoader;
