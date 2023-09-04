'use client'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/server/auth";
import { FaDiscord, FaGithub, FaGoogle, FaSignInAlt, FaUserPlus } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { type MouseEvent, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState({
    email: '',
    password: ''
  })
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: ''
  })


  const registerRouter = api.registrationRouter.register.useMutation({});

  async function handleLogin(e: MouseEvent) {
    e.preventDefault();

    if (!data?.email || !data?.password) {
      toast({
        variant: 'destructive',
        title: 'Error logging in',
        description: 'Email and Password cannot be empty',
      })
      return;
    }
    const response = await signIn('credentials', { ...data, redirect: false });
    if (!response?.ok) {
      toast({
        variant: 'destructive',
        title: 'Error logging in',
        description: 'Email or Password Incorrect!',
      })
    } else {
      await router.push('/')
    }
  }


  function handleRegister(e: MouseEvent) {
    e.preventDefault();
    if (!registerData?.email || !registerData?.name || !registerData?.password) {
      toast({
        variant: 'destructive',
        title: 'Error Creating User',
        description: 'All fields are required',
      })
      return;
    }
    registerRouter.mutateAsync(registerData).then(data => {
      const { target } = data
      if (Object.hasOwn(data, 'target')) {
        if (target === 'User_email_key') {
          toast({
            variant: 'destructive',
            title: 'Email Already Registered',
            description: 'Please try another email address.'
          })
        }
      } else {
        toast({
          title: 'Account created successfully',
          description: 'Please login with your credentials'
        })
      }
    }).catch(err => {
      console.log(err);
    })
  }
  return (
    <>
      <main className="container mx-auto h-screen grid place-content-center gap-5">
        <Link href={'/'} className="font-bold text-3xl">Think.</Link>
        <div className="w-[450px]">
          <Tabs defaultValue="login" >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="">Login</TabsTrigger>
              <TabsTrigger value="register" className="">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Get right back to where you left off!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label className='text-slate-400' htmlFor="email">Email</Label>
                    <Input type='text' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} id="email" name="email" />
                  </div>
                  <div className="space-y-1">
                    <Label className='text-slate-400 ' htmlFor="password">Password</Label>
                    <Input type='password' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} id="password" name="password" />
                  </div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-4">
                  <Button className="hover:bg-blue-700 w-fit" onClick={(e) => void handleLogin(e)}>
                    <FaSignInAlt className="mr-3" /> Login
                  </Button>
                  <Link className="text-xs text-slate-400 hover:text-slate-800 hover:border-slate-800 border h-full grid items-center px-3 rounded justify-self-end" href='#'>Forgot password?</Link>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="register">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Register</CardTitle>
                  <CardDescription>
                    Create your new account here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="register_name">name</Label>
                    <Input value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} id="register_name" type="text" name='register_name' />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="register_email">email</Label>
                    <Input value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} id="register_email" type="email" name='register_email' />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="register_password">password</Label>
                    <Input value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} id="register_password" type="password" name='register_password' />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="hover:bg-blue-700" onClick={(e) => void handleRegister(e)}>
                    <FaUserPlus className="mr-3" /> Create Account
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 rounded overflow-hidden">
            {Object.values(providers).map((provider) => (
              provider.id != 'credentials' && <Button key={provider.id} onClick={() => void signIn(provider.id)} size={"lg"} variant={"outline"} className="mb-2 w-full rounded hover:bg-slate-800 hover:text-slate-100">
                <span className="mr-2 text-lg">
                  {provider.name === 'Discord' ? <FaDiscord /> : null}
                  {provider.name === 'Github' ? <FaGithub /> : null}
                  {provider.name === 'Google' ? <FaGoogle /> : null}
                </span>
                {provider.name}
              </Button>
            ))}
          </div>
        </div>
      </main>

    </>
  )
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  }
}
