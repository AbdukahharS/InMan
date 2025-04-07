'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  AlignStartVertical,
  Download,
  Factory,
  History,
  Lock,
  RotateCcw,
  ShoppingBag,
  UsersRound,
  Printer,
  LoaderCircle,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { useToImage } from '@hcorta/react-to-image'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '../ui/input'
import { DialogClose } from '@radix-ui/react-dialog'
import { useToast } from '../ui/use-toast'
import usePrompt from '@/hooks/usePrompt'
import { getProducts } from '@/db/functions/productFns'
import { getFolders } from '@/db/functions/folderFns'

const Navbar = () => {
  const { ref, isLoading, getPng } = useToImage()
  const { reload } = useRouter()
  const { toast } = useToast()
  const prompt = usePrompt()
  const pathname = usePathname()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState([])
  const [folders, setFolders] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  const handlePrint = async () => {
    setIsLoadingProducts(true)
    try {
      const foldersRes = await getFolders()
      const res = await getProducts()
      setProducts(res)
      setFolders(foldersRes)
      console.log(res)

      setTimeout(() => {
        getPng()
      }, 1000)
    } catch (error) {
      toast({ title: 'Xatolik yuz berdi', variant: 'destructive' })
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const getLinkClasses = (path: string) =>
    pathname === path
      ? 'underline' // Active link styles
      : ''

  const handleClick = async () => {
    const log = window.localStorage.getItem('login') || 'f'
    const pass = window.localStorage.getItem('password') || 'm'

    if (login !== log)
      return toast({
        title: 'Login noto`g`ri kiritildi',
        variant: 'destructive',
      })
    if (password !== pass)
      return toast({
        title: 'Parol noto`g`ri kiritildi',
        variant: 'destructive',
      })

    const newlogin = await prompt('Yangi login kiritng:')
    const newpass = await prompt('Yangi parol kiritng:')

    if (!newlogin || !newpass)
      return toast({
        title: 'Login va parol kiritilmadi',
        variant: 'destructive',
      })

    window.localStorage.setItem('login', newlogin)
    window.localStorage.setItem('password', newpass)

    toast({
      title: 'Login va parol muvaffaqiyatli o`zgartirildi',
    })
    setLogin('')
    setPassword('')
  }

  return (
    <>
      <nav className='bg-accent h-10 fixed top-0 w-full flex flex-row justify-between items-center border-b'>
        <div className='flex flex-row gap-2 items-center'>
          <Link href='/'>
            <Image src='/icons/icon.svg' width={46} height={46} alt='Logo' />
          </Link>
          <Separator className='h-6 w-px bg-accent-foreground' />

          <Button asChild variant='link'>
            <Link href='/sale' className={getLinkClasses('/sale/')}>
              <ShoppingBag className='mr-2 h-6 w-6' />
              <span className='text-lg'>Savdo</span>
            </Link>
          </Button>
          <Separator className='h-6 w-px bg-accent-foreground' />

          <Button asChild variant='link'>
            <Link href='/customers' className={getLinkClasses('/customers/')}>
              <UsersRound className='mr-2 h-6 w-6' />
              <span className='text-lg'>Mijozlar</span>
            </Link>
          </Button>
          <Separator className='h-6 w-px bg-accent-foreground' />

          <Button asChild variant='link'>
            <Link href='/suppliers' className={getLinkClasses('/suppliers/')}>
              <Factory className='mr-2 h-6 w-6' />
              <span className='text-lg'>Ta'minotchilar</span>
            </Link>
          </Button>
          <Separator className='h-6 w-px bg-accent-foreground' />

          <Button asChild variant='link'>
            <Link href='/intake' className={getLinkClasses('/intake/')}>
              <Download className='mr-2 h-6 w-6' />
              <span className='text-lg'>Ta'minot kirimi</span>
            </Link>
          </Button>
          <Separator className='h-6 w-px bg-accent-foreground' />

          <Button asChild variant='link'>
            <Link href='/history' className={getLinkClasses('/history/')}>
              <History className='mr-2 h-6 w-6' />
              <span className='text-lg'>Kirim-chiqim tarixi</span>
            </Link>
          </Button>
          <Separator className='h-6 w-px bg-accent-foreground' />

          <Button asChild variant='link'>
            <Link href='/ranking' className={getLinkClasses('/ranking/')}>
              <AlignStartVertical className='mr-2 h-6 w-6' />
              <span className='text-lg'>Reyting</span>
            </Link>
          </Button>
          <Separator className='h-6 w-px bg-accent-foreground' />
        </div>
        <div className='flex flex-row items-center'>
          <Button variant='ghost' onClick={reload}>
            <RotateCcw className='mr-2 h-6 w-6' />
          </Button>
          <Button variant='ghost' onClick={handlePrint}>
            {isLoadingProducts || isLoading ? (
              <LoaderCircle className='mr-2 h-6 w-6 animate-spin' />
            ) : (
              <Printer className='mr-2 h-6 w-6' />
            )}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='ghost'>
                <Lock className='mr-2 h-6 w-6' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Login va parolni o'rgartirish</DialogTitle>
                <DialogDescription>
                  Hozirgi login va parolni kiriting
                </DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  placeholder='Login'
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  type='text'
                  className='mb-4'
                />
                <Input
                  placeholder='Parol'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type='password'
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='ghost'>Bekor qilish</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleClick}>Yuborish</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
      <div
        className='absolute top-0 -z-50 left-0 w-full bg-background'
        ref={ref}
      >
        {!isLoadingProducts && products.length && folders.length ? (
          <table className='w-full overflow-y-auto table-aut bg-background'>
            <thead>
              <tr>
                <th>No</th>
                <th>Tovar nomi</th>
                <th>Tovar narxi</th>
                <th>O'lchov birligi</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                let productCounter = 0
                return folders
                  .filter((f) => {
                    return products.some((p) => p.folder === f._id)
                  })
                  .map((f) => (
                    <React.Fragment key={f._id}>
                      <tr>
                        <td
                          colSpan={4}
                          className='text-xl font-semibold text-center bg-gray-100'
                        >
                          {f.name}
                        </td>
                      </tr>
                      {products
                        .filter((p) => p.folder === f._id)
                        .map((doc) => {
                          productCounter++
                          return (
                            <tr key={doc._id}>
                              <td className='px-2'>{productCounter}</td>
                              <td className='px-2'>{doc.name}</td>
                              <td className='px-2'>{doc.sellPrice}</td>
                              <td className='px-2'>
                                {doc.unit === 'piece' ? 'dona' : doc.unit}
                              </td>
                            </tr>
                          )
                        })}
                    </React.Fragment>
                  ))
              })()}
            </tbody>
          </table>
        ) : (
          ''
        )}
      </div>
    </>
  )
}

export default Navbar
