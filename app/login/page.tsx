import Image from "next/image";

// Components
import LoginForm from "./components/loginForm";
import { ThemeToggler } from "@/components/ui/theme-toggler"
import SceneClient from "@/components/3d/SceneClient";

export default function Login() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-white to-primary/30 dark:from-primary/20 dark:via-primary/10 dark:via-neutral-900  p-4">
            <div className="flex flex-col sm:flex-row gap-4 border rounded-[28px] p-0 sm:p-6 w-full max-w-5xl bg-white dark:bg-transparent backdrop-blur-md dark:shadow-lg">

                {/* SHow drone */}

                <div className="flex w-full sm:w-1/2 h-[320px] sm:h-[550px]">
                    {/* <Image
                        src="/assets/auth/drone_show.jpg"
                        alt="Login Drone"
                        width={400}
                        height={600}
                        className="h- w-full object-cover border rounded-[35px] dark:filter dark:saturate-0"
                    /> */}

                    <div className="w-full h-full sm:border rounded-2xl overflow-hidden">
                        <SceneClient />
                    </div>
                </div>

                {/* Login form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center ">
                    <div className="w-full max-w-md">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <ThemeToggler duration={700} className="absolute top-4 right-4" />
        </div>
    )
}