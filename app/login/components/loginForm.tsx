"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSession } from "@/lib/actions/user";
import { useUser } from "@/components/UserProvider";
import axios from 'axios';

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@iconify/react";
import { Spinner } from "@/components/ui/loader";
import { toast } from "sonner";

export default function LoginForm() {
    const [email, setEmail] = useState('admincentral@ss.com');
    const [password, setPassword] = useState("je suis l'admin central");

    // email: admincentral@ss.com
    // password: je suis l'admin central

    // email : root@maska.com
    // Password: PAtr02

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // USER CONTEXT
    const { user, setUser } = useUser();

    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // // DEBUG
        // console.log('Submitting', { email, password });

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/accounts/users/login/`, { email, password });

            response.status === 401 && toast.error("Accès refusé.");

            if (response.status === 200) {

                // const data = JSON.stringify(response.data);

                // // DEBUG
                // console.log('Login successful', response.data);

                await createClientSession({userId: response.data.user.id, token: response.data.access});

                // MAJ global user context
                setUser(response.data.user);

                toast.success("Connexion réussie !");
                router.push('/dashboard');
            }
        } catch (error) {
            // console.error('Login failed', error);
            console.log(error);
            toast.error("Échec connexion. Veuillez vérifier vos identifiants.");
        }finally {
            setLoading(false);
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div className="w-full max-w-md flex flex-col items-center justify-center p-0 sm:p-6">
            <Image
                src="/assets/logo/logo.png"
                alt="Login Image"
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 mb-4 hidden sm:"
            />

            <div className="flex flex-col gap-2 p-2 w-full">
                <h2 className="text-lg sm:text-2xl text-center">Veuillez vous connecter sur votre portail Slater Security</h2>
                <p className="text-center text-xs sm:text-sm text-foreground/60">Entrez vos identifiants fournis par votre administrateur d&apos;entreprise</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-2 w-full">

                <div className="flex flex-col gap-2 w-full">
                    <Input
                        type="email"
                        placeholder="Votre adresse email"
                        required
                        className="w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2 relative w-full">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mot de passe"
                        required
                        className="w-full pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Icon
                        icon={showPassword ? "mdi:eye-outline" : "mdi:eye-off-outline"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl sm:text-2xl text-foreground/50"
                        onClick={togglePasswordVisibility}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        id="checkbox"
                        onClick={() => { }}
                        className="mb-0"
                    />
                    <Label htmlFor="checkbox" className="cursor-pointer font-normal"> Se souvenir de moi </Label>
                </div>

                <Button type="submit" className="w-full"> {loading && <Spinner />} {loading ? "Connexion..." : "Se connecter"} </Button>
            </form>
        </div>
    )
}