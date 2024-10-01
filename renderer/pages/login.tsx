'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import useLogin from '@/hooks/useLogin'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Login = () => {
  const { login } = useLogin()
  const router = useRouter()
  const { toast } = useToast()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleClick = () => {
    const error = login(username, password)
    if (error && 'message' in error && error.message === 'Invalid credentials') {
      toast({
        title: 'Xatolik yuz berdi',
        description: 'Parol yoki login noto`g`ri kiritildi',
        variant: 'destructive',
      })
    } else {
      router.push('/')
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[100vh]'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Tizimga kirish</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='login'>Login</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='Loginni kiriting...'
                  name='login'
                />
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='password'>Parol</Label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type='password'
                  name='password'
                  placeholder='Parolni kiriting...'
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Button onClick={handleClick}>Tizimga kirish</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
