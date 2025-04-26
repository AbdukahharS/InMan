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
  Check,
  X,
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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

// Type definitions
export interface Product {
  _id: string
  name: string
  buyPrice: number
  sellPrice: number
  supplier: string
  folder: string
  unit: 'piece' | 'm' | 'kg' | 'm2'
  _rev: string
}

export interface Folder {
  _id: string
  name: string
  parent?: string | null
}

const Navbar = () => {
  const { ref, isLoading, getPng } = useToImage()
  const { reload } = useRouter()
  const { toast } = useToast()
  const prompt = usePrompt()
  const pathname = usePathname()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)

  // Load folders and prepare the selection state
  const loadFolders = async () => {
    try {
      const foldersRes = await getFolders()
      setFolders(foldersRes)
      // Initially select all folders
      setSelectedFolders(foldersRes.map((folder) => folder._id))
    } catch (error) {
      toast({
        title: 'Papkalarni yuklashda xatolik yuz berdi',
        variant: 'destructive',
      })
    }
  }

  // Function to print with selected folders
  const handlePrint = async () => {
    setIsPrintDialogOpen(false)
    setIsLoadingProducts(true)
    try {
      const res = await getProducts()
      // Filter products based on selected folders
      const filteredProducts = res.filter((product) =>
        selectedFolders.includes(product.folder)
      )
      setProducts(filteredProducts)
      console.log('Filtered products:', filteredProducts)

      setTimeout(() => {
        getPng()
      }, 1000)
    } catch (error) {
      toast({ title: 'Xatolik yuz berdi', variant: 'destructive' })
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Handle toggling folder selection
  const toggleFolder = (folderId: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    )
  }

  // Check all folders
  const selectAllFolders = () => {
    setSelectedFolders(folders.map((folder) => folder._id))
  }

  // Uncheck all folders
  const unselectAllFolders = () => {
    setSelectedFolders([])
  }

  // Open print dialog and load folders
  const openPrintDialog = () => {
    loadFolders()
    setIsPrintDialogOpen(true)
  }

  // Helper function to check if a folder is a child
  const isChildFolder = (folder: Folder) =>
    folder.parent !== undefined && folder.parent !== null

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

  // Organize folders into a hierarchy for better display
  const organizeFolders = () => {
    // First identify root folders (those without parents)
    const rootFolders = folders.filter((folder) => !folder.parent)

    // Then identify child folders with their parent relationships
    const childFolders = folders.filter((folder) => folder.parent)

    // Return them in order - roots first, then children
    return [...rootFolders, ...childFolders]
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

          {/* Print button now opens the folder selection dialog */}
          <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
            <DialogTrigger asChild>
              <Button variant='ghost' onClick={openPrintDialog}>
                {isLoadingProducts || isLoading ? (
                  <LoaderCircle className='mr-2 h-6 w-6 animate-spin' />
                ) : (
                  <Printer className='mr-2 h-6 w-6' />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-md max-h-[80vh]'>
              <DialogHeader>
                <DialogTitle>Papkalarni tanlang</DialogTitle>
                <DialogDescription>
                  Narxlar ro'yxatiga kiritish uchun papkalarni tanlang
                </DialogDescription>
              </DialogHeader>

              <div className='flex justify-between mb-4'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={selectAllFolders}
                  className='flex items-center gap-1'
                >
                  <Check className='h-4 w-4' /> Barchasini tanlash
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={unselectAllFolders}
                  className='flex items-center gap-1'
                >
                  <X className='h-4 w-4' /> Tanlovni bekor qilish
                </Button>
              </div>

              <div className='overflow-y-auto max-h-[40vh] pr-2'>
                {organizeFolders()
                  .filter((f) => !f.parent)
                  .map((folder) => (
                    <>
                      <div
                        key={folder._id}
                        className={`flex items-center space-x-2 mb-2`}
                      >
                        <Checkbox
                          id={folder._id}
                          checked={selectedFolders.includes(folder._id)}
                          onCheckedChange={() => toggleFolder(folder._id)}
                        />
                        <Label htmlFor={folder._id} className='flex flex-col'>
                          <span>{folder.name}</span>
                        </Label>
                      </div>
                      {organizeFolders()
                        .filter((f) => f.parent === folder._id)
                        .map((childFolder) => (
                          <div
                            key={childFolder._id}
                            className={`flex items-center space-x-2 mb-2 ml-6 border-l-2 pl-2 border-gray-200`}
                          >
                            <Checkbox
                              id={childFolder._id}
                              checked={selectedFolders.includes(
                                childFolder._id
                              )}
                              onCheckedChange={() =>
                                toggleFolder(childFolder._id)
                              }
                            />
                            <Label
                              htmlFor={childFolder._id}
                              className='flex flex-col'
                            >
                              <span>{childFolder.name}</span>
                            </Label>
                          </div>
                        ))}
                    </>
                  ))}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='ghost'>Bekor qilish</Button>
                </DialogClose>
                <Button
                  onClick={handlePrint}
                  disabled={selectedFolders.length === 0}
                >
                  Chop etish
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
      <div className='absolute top-[-9999999999999999px] -z-50 left-0 w-full bg-background'>
        <div className='w-full h-full bg-background' ref={ref}>
          {!isLoadingProducts && products.length && folders.length ? (
            <table className='w-full overflow-y-auto table-auto bg-background'>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tovar nomi</th>
                  <th>Tovar narxi</th>
                  <th className='w-32'>O'lchov birligi</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let productCounter = 0
                  return folders
                    .filter((f) => {
                      // Only show folders that are selected AND have products
                      return (
                        selectedFolders.includes(f._id) &&
                        products.some((p) => p.folder === f._id)
                      )
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
      </div>
    </>
  )
}

export default Navbar
