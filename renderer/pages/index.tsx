'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Download,
  Factory,
  History,
  ShoppingBag,
  UsersRound,
  Warehouse,
} from 'lucide-react'

import useLogin from '@/hooks/useLogin'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { loading, isAuthenticated } = useLogin()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated])

  return (!loading && isAuthenticated) && (
    <main className='flex min-h-screen flex-col justify-center items-center gap-4'>
      <Image src='/icons/icon.svg' width={256} height={256} alt='Logo' />
      <Button
        asChild
        variant='outline'
        className='w-full max-w-sm p-8 justify-start '
      >
        <Link href='/customers'>
          <UsersRound className='mr-4' size={42} />
          <span className='text-3xl'>Mijozlar</span>
        </Link>
      </Button>
      <Button
        asChild
        variant='outline'
        className='w-full max-w-sm p-8 justify-start '
      >
        <Link href='/sale'>
          <ShoppingBag className='mr-4' size={42} />
          <span className='text-3xl'>Savdo</span>
        </Link>
      </Button>
      <Button
        asChild
        variant='outline'
        className='w-full max-w-sm p-8 justify-start '
      >
        <Link href='/suppliers'>
          <Factory className='mr-4' size={42} />
          <span className='text-3xl'>Ta'minotchilar</span>
        </Link>
      </Button>
      <Button
        asChild
        variant='outline'
        className='w-full max-w-sm p-8 justify-start'
      >
        <Link href='/intake'>
          <Download size={42} className='mr-4' />
          <span className='text-3xl'>Ta'minot kirimi</span>
        </Link>
      </Button>
      <Button
        asChild
        variant='outline'
        className='w-full max-w-sm p-8 justify-start '
      >
        <Link href='/history'>
          <History className='mr-4' size={42} />
          <span className='text-3xl'>Kirim-chiqim tarixi</span>
        </Link>
      </Button>
      {/* <Button
        asChild
        variant='outline'
        className='w-full max-w-sm p-8 justify-start '
      >
        <Link href='/warehouse'>
          <Warehouse className='mr-4' size={42} />
          <span className='text-3xl'>Ombor</span>
        </Link>
      </Button> */}
      {/* <Button
        asChild
        variant='outline'
        className='w-full max-w-sm p-8 justify-start '
      >
        <Link href='/statistics'>
          <ChartNoAxesCombined className='mr-4' size={42} />
          <span className='text-3xl'>Statistika</span>
        </Link>
      </Button> */}
    </main>
  )
}
